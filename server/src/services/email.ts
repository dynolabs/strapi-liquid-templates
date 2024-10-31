import type { Core } from '@strapi/strapi';
import { yup } from '@strapi/utils';
import { htmlToText } from 'html-to-text';
import { decode } from 'html-entities';
import { generateHtmlTemplate } from './utils/generateHtmlTemplate';

const LIQUID_TEMPLATE_MODEL_UID = 'plugin::liquid-templates.liquid-template';

type TEmailOptions = {
  to: string | string[];
  from?: string;
  replyTo?: string;
  [key: string]: any;
};

type TEmailTemplate = {
  referenceId: string;
  subject?: string;
  text?: string;
  html?: string;
};

type TEmailData = {
  [key: string]: any;
};

// Yup schema for validating email options
const emailOptionsSchema = yup.object().shape({
  to: yup.lazy((value) =>
    Array.isArray(value)
      ? yup.array().of(yup.string().email('Invalid "to" email address'))
      : yup.string().email('Invalid "to" email address')
  ),
  from: yup.string().email('Invalid "from" email address'),
  replyTo: yup.string().email('Invalid "replyTo" email address'),
  // You can extend this schema with other options as needed
  attachment: yup.mixed().notRequired(),
  attachments: yup.mixed().notRequired(),
  headers: yup.mixed().notRequired(),
});

// Yup schema for validating email template
const emailTemplateSchema = yup.object().shape({
  referenceId: yup
    .string()
    .required()
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  subject: yup.string().notRequired(),
  text: yup.string().notRequired(),
  html: yup.string().notRequired(),
});

const emailSchema = yup.object().shape({
  template: emailTemplateSchema.required(),
  options: emailOptionsSchema.required(),
});

const email = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * fill subject, text and html using lodash template
   * @param {object} options - to, from and replyto...
   * @param {object} template - object containing attributes to fill
   * @param {object} data - data used to fill the template
   * @returns Promise<{ subject, text, subject }>
   */

  sendLiquidEmail: async (
    options: TEmailOptions,
    template: TEmailTemplate,
    data: string | TEmailData
  ) => {
    await emailSchema.validate({ template, options });

    // Fetch the liquid template by referenceId
    const liquidTemplate = await strapi
      .query(LIQUID_TEMPLATE_MODEL_UID)
      .findOne({ where: { referenceId: template.referenceId }, populate: ['baseTemplate'] });

    if (!liquidTemplate) {
      throw new Error(`Liquid template with referenceId "${template.referenceId}" not found`);
    }

    const { bodyHtml, subject, baseTemplate } = liquidTemplate;

    // Get the base template
    const htmlTemplate = await generateHtmlTemplate({
      template: bodyHtml,
      baseTemplate: baseTemplate,
      sampleData: data,
    });

    let bodyText = liquidTemplate.bodyText;

    // Fallback to plain text if bodyHtml exists but bodyText is empty
    if ((!bodyText || !bodyText.length) && bodyHtml && bodyHtml.length) {
      bodyText = htmlToText(htmlTemplate, {
        wordwrap: 130,
        trimEmptyLines: true,
        uppercaseHeadings: false,
      });
    }

    const emailTemplate = {
      ...template,
      subject: decode(template.subject || subject || 'No Subject'),
      html: decode(htmlTemplate),
      text: decode(bodyText),
    };

    // Send email
    return strapi.plugin('email').provider.send({ ...options, ...emailTemplate });
  },
});

export { email };
