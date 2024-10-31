import type { Core } from '@strapi/strapi';

const LIQUID_BASE_TEMPLATE_MODEL_UID = 'plugin::liquid-templates.liquid-base-template';

const liquidBaseTemplate = ({ strapi }: { strapi: Core.Strapi }) => ({
  find(params) {
    const query = strapi
      .get('query-params')
      .transform(LIQUID_BASE_TEMPLATE_MODEL_UID, params ?? {});

    return strapi.db.query(LIQUID_BASE_TEMPLATE_MODEL_UID).findMany(query);
  },
  findOne(id, params) {
    const query = strapi
      .get('query-params')
      .transform(LIQUID_BASE_TEMPLATE_MODEL_UID, params ?? {});

    return strapi.db.query(LIQUID_BASE_TEMPLATE_MODEL_UID).findOne({
      ...query,
      where: {
        $and: [{ id }, query.where || {}],
      },
    });
  },
  create(data) {
    return strapi.db.query(LIQUID_BASE_TEMPLATE_MODEL_UID).create({ data });
  },
  delete(id) {
    return strapi.db.query(LIQUID_BASE_TEMPLATE_MODEL_UID).delete({ where: { id } });
  },
  update(id, data) {
    return strapi.db.query(LIQUID_BASE_TEMPLATE_MODEL_UID).update({ data, where: { id } });
  },
  count(params) {
    const query = strapi
      .get('query-params')
      .transform(LIQUID_BASE_TEMPLATE_MODEL_UID, params ?? {});

    return strapi.db.query(LIQUID_BASE_TEMPLATE_MODEL_UID).count(query);
  },
});

export { liquidBaseTemplate };
