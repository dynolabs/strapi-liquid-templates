import type { Core } from '@strapi/strapi';
import { generateHtmlTemplate } from './utils/generateHtmlTemplate';

const CORE_TEMPLATE_MAPPER = {
  email_confirmation: {
    referenceId: 'email-confirmation',
    name: 'Email confirmation',
  },
  reset_password: {
    referenceId: 'reset-password',
    name: 'Reset password',
  },
};

const coreTemplate = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findOne(id) {
    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const coreTemplates = await pluginStore.get({ key: 'email' });

    const coreTemplate = coreTemplates[id];
    const defaultTemplateData = CORE_TEMPLATE_MAPPER[id];

    if (coreTemplate && defaultTemplateData) {
      const templateOptions = coreTemplate.options;

      return {
        default: coreTemplate,
        referenceId: defaultTemplateData.referenceId,
        name: defaultTemplateData.name,
        subject: templateOptions?.object
          .replace(/<%=|&#x3C;%=/g, '{{')
          .replace(/%>|%&#x3E;/g, '}}'),
        bodyHtml:
          templateOptions.bodyHtml ??
          templateOptions?.message.replace(/<%=|&#x3C;%=/g, '{{').replace(/%>|%&#x3E;/g, '}}'),
        baseTemplate: coreTemplate.options?.baseTemplate,
      };
    }

    return null;
  },
  async update(id, data) {
    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    });

    const coreTemplates = (await pluginStore.get({ key: 'email' })) as { [key: string]: any };
    let baseTemplate = null;

    if (data.baseTemplate) {
      baseTemplate = await strapi
        .plugin('liquid-templates')
        .service('liquidBaseTemplate')
        .findOne(data.baseTemplate);
    }

    const liquidTemplate = await generateHtmlTemplate({
      template: data.bodyHtml.replace(/{{/g, '<%=').replace(/}}/g, '%>'),
      baseTemplate: baseTemplate,
    });

    const updatedCoreTemplates = {
      ...coreTemplates,
      [id]: {
        ...coreTemplates[id],
        options: {
          ...coreTemplates[id].options,
          object: data.subject.replace(/{{/g, '<%=').replace(/}}/g, '%>'),
          message: liquidTemplate.replace(/{{/g, '<%=').replace(/}}/g, '%>'),
          bodyHtml: data.bodyHtml,
          baseTemplate: baseTemplate,
        },
      },
    };

    return pluginStore.set({ key: 'email', value: updatedCoreTemplates });
  },
});

export { coreTemplate };
