import type { Core } from '@strapi/strapi';
import { generateHtmlTemplate } from './utils/generateHtmlTemplate';

const LIQUID_TEMPLATE_MODEL_UID = 'plugin::liquid-templates.liquid-template';

const liquidTemplate = ({ strapi }: { strapi: Core.Strapi }) => ({
  find(params) {
    const query = strapi.get('query-params').transform(LIQUID_TEMPLATE_MODEL_UID, params ?? {});

    return strapi.db.query(LIQUID_TEMPLATE_MODEL_UID).findMany(query);
  },
  findOne(id, params) {
    const query = strapi.get('query-params').transform(LIQUID_TEMPLATE_MODEL_UID, params ?? {});

    return strapi.db.query(LIQUID_TEMPLATE_MODEL_UID).findOne({
      ...query,
      where: {
        $and: [{ id }, query.where || {}],
      },
    });
  },
  create(data) {
    return strapi.db.query(LIQUID_TEMPLATE_MODEL_UID).create({ data });
  },
  update(id, data) {
    return strapi.db.query(LIQUID_TEMPLATE_MODEL_UID).update({ data, where: { id } });
  },
  delete(id) {
    return strapi.db.query(LIQUID_TEMPLATE_MODEL_UID).delete({ where: { id } });
  },
  count(params) {
    const query = strapi.get('query-params').transform(LIQUID_TEMPLATE_MODEL_UID, params ?? {});

    return strapi.db.query(LIQUID_TEMPLATE_MODEL_UID).count(query);
  },
  getHtmlTemplate(data) {
    return generateHtmlTemplate(data);
  },
});

export { liquidTemplate };
