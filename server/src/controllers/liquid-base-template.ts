import type { Core } from '@strapi/strapi';

import { validateCreateLiquidTemplateBody } from './validation/liquid-template';

const LIQUID_BASE_TEMPLATE_MODEL_UID = 'plugin::liquid-templates.liquid-base-template';

const sanitizeOutput = async (data, ctx) => {
  const schema = strapi.getModel(LIQUID_BASE_TEMPLATE_MODEL_UID);
  const { auth } = ctx.state;

  return strapi.contentAPI.sanitize.output(data, schema, { auth });
};

const validateQuery = async (ctx) => {
  const schema = strapi.getModel(LIQUID_BASE_TEMPLATE_MODEL_UID);
  const { auth } = ctx.state;

  return strapi.contentAPI.validate.query(ctx.query, schema, { auth });
};

const sanitizeQuery = async (ctx) => {
  const schema = strapi.getModel(LIQUID_BASE_TEMPLATE_MODEL_UID);
  const { auth } = ctx.state;

  return strapi.contentAPI.sanitize.query(ctx.query, schema, { auth });
};

const liquidBaseTemplate = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    await validateQuery(ctx);

    const sanitizedQueryParams = await sanitizeQuery(ctx);

    let data = await strapi
      .plugin('liquid-templates')
      .service('liquidBaseTemplate')
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
      .service('liquidBaseTemplate')
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
      return ctx.badRequest(error);
    }

    const count = await strapi
      .plugin('liquid-templates')
      .service('liquidBaseTemplate')
      .count({ filters: { referenceId: { $eq: body.referenceId } } });

    if (count > 0) {
      return ctx.badRequest('Reference ID already exists');
    }

    let data = await strapi.plugin('liquid-templates').service('liquidBaseTemplate').create(body);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }
    ctx.created(data);
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { body } = ctx.request;

    try {
      await validateCreateLiquidTemplateBody(body);
    } catch (error) {
      return ctx.badRequest(error);
    }

    const templates = await strapi
      .plugin('liquid-templates')
      .service('liquidBaseTemplate')
      .find({ filters: { referenceId: { $eq: body.referenceId } } });

    if (templates.length > 1) {
      return ctx.badRequest('Reference ID already exists');
    }

    if (templates.length === 1 && String(templates[0].id) !== id) {
      return ctx.badRequest('Reference ID already exists');
    }

    let data = await strapi
      .plugin('liquid-templates')
      .service('liquidBaseTemplate')
      .update(id, body);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }

    ctx.body = data;
  },
  async delete(ctx) {
    const { id } = ctx.params;

    const data = await strapi.plugin('liquid-templates').service('liquidBaseTemplate').delete(id);

    ctx.body = data;
  },
});

export { liquidBaseTemplate };
