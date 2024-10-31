import type { Core } from '@strapi/strapi';

import {
  validateCreateLiquidTemplateBody,
  validateEmailSchema,
  validateGetHtmlTemplateBody,
} from './validation/liquid-template';

const coreTemplate = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;

    if (!['email-confirmation', 'reset-password'].includes(id))
      return ctx.badRequest('No valid core message key');

    const emailKey = id === 'email-confirmation' ? 'email_confirmation' : 'reset_password';

    const data = await strapi.plugin('liquid-templates').service('coreTemplate').findOne(emailKey);

    if (data) {
      ctx.body = data;
    } else {
      return ctx.notFound();
    }
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    if (!['email-confirmation', 'reset-password'].includes(id))
      return ctx.badRequest('No valid core message key');

    const emailKey = id === 'email-confirmation' ? 'email_confirmation' : 'reset_password';

    try {
      await validateCreateLiquidTemplateBody(body);
    } catch (error) {
      return ctx.badRequest(error, error.details);
    }

    const data = await strapi
      .plugin('liquid-templates')
      .service('coreTemplate')
      .update(emailKey, body);

    ctx.body = data;
  },
});

export { coreTemplate };
