import type { Core } from '@strapi/strapi';

import {
  validateCreateLiquidTemplateBody,
  validateEmailSchema,
  validateGetHtmlTemplateBody,
} from './validation/liquid-template';

const sanitizeOutput = async (data, ctx) => {
  const schema = strapi.getModel('plugin::liquid-templates.liquid-template');
  const { auth } = ctx.state;

  return strapi.contentAPI.sanitize.output(data, schema, { auth });
};

const validateQuery = async (ctx) => {
  const schema = strapi.getModel('plugin::liquid-templates.liquid-template');
  const { auth } = ctx.state;

  return strapi.contentAPI.validate.query(ctx.query, schema, { auth });
};

const sanitizeQuery = async (ctx) => {
  const schema = strapi.getModel('plugin::liquid-templates.liquid-template');
  const { auth } = ctx.state;

  return strapi.contentAPI.sanitize.query(ctx.query, schema, { auth });
};

const liquidTemplate = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    await validateQuery(ctx);

    const sanitizedQueryParams = await sanitizeQuery(ctx);

    let data = await strapi
      .plugin('liquid-templates')
      .service('liquidTemplate')
      .find(sanitizedQueryParams);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }

    ctx.body = data;
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    await validateQuery(ctx);
    const sanitizedQuery = await sanitizeQuery(ctx);

    let data = await strapi
      .plugin('liquid-templates')
      .service('liquidTemplate')
      .findOne(id, sanitizedQuery);

    if (data) {
      data = await sanitizeOutput(data, ctx);
      ctx.body = data;
    } else {
      return ctx.notFound();
    }
  },
  async create(ctx) {
    const { body } = ctx.request;

    try {
      await validateCreateLiquidTemplateBody(body);
    } catch (error) {
      return ctx.badRequest(error, error.details);
    }

    const count = await strapi
      .plugin('liquid-templates')
      .service('liquidTemplate')
      .count({ filters: { referenceId: { $eq: body.referenceId } } });

    if (count > 0) {
      return ctx.badRequest('Reference Id already exists');
    }

    let data = await strapi.plugin('liquid-templates').service('liquidTemplate').create(body);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }
    ctx.created(data);
  },
  async count(ctx) {
    await validateQuery(ctx);

    const sanitizedQuery = await sanitizeQuery(ctx);

    const count = await strapi
      .plugin('liquid-templates')
      .service('liquidTemplate')
      .count(sanitizedQuery);

    ctx.body = { count };
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    try {
      await validateCreateLiquidTemplateBody(body);
    } catch (error) {
      return ctx.badRequest(error, error.details);
    }

    const templates = await strapi
      .plugin('liquid-templates')
      .service('liquidTemplate')
      .find({ filters: { referenceId: { $eq: body.referenceId } } });

    if (templates.length > 1) {
      return ctx.badRequest('Reference ID already exists');
    }

    if (templates.length === 1 && String(templates[0].id) !== id) {
      return ctx.badRequest('Reference ID already exists');
    }

    let data = await strapi.plugin('liquid-templates').service('liquidTemplate').update(id, body);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }

    ctx.body = data;
  },
  async delete(ctx) {
    const { id } = ctx.params;

    const data = await strapi.plugin('liquid-templates').service('liquidTemplate').delete(id);

    ctx.body = data;
  },
  async getHtmlTemplate(ctx) {
    const { body } = ctx.request;

    try {
      await validateGetHtmlTemplateBody(body);
    } catch (error) {
      return ctx.badRequest(error, error.details);
    }

    try {
      const html = await strapi
        .plugin('liquid-templates')
        .service('liquidTemplate')
        .getHtmlTemplate(body);

      ctx.body = { html };
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  async sendEmail(ctx) {
    const { body } = ctx.request;
    try {
      await validateEmailSchema(body);
    } catch (error) {
      return ctx.badRequest(error, error.details);
    }

    try {
      const response = await strapi
        .plugin('liquid-templates')
        .service('email')
        .sendLiquidEmail(body.options, body.template, body.data);

      ctx.body = response;
    } catch (error) {
      return ctx.badRequest(error, error.details);
    }
  },
});

export { liquidTemplate };
