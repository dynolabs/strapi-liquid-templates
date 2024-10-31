import { yup, validateYupSchema } from '@strapi/utils';

const createLiquidTemplateBody = yup.object().shape({
  referenceId: yup
    .string()
    .required()
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: yup.string().optional(),
  subject: yup.string().optional(),
  bodyHtml: yup.string().required(),
  bodyText: yup.string().optional(),
});

const getHtmlTemplateBody = yup.object().shape({
  template: yup.string().required(),
  baseTemplate: yup
    .object()
    .shape({
      referenceId: yup
        .string()
        .required()
        .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/),
      bodyHtml: yup.string().required(),
    })
    .nullable()
    .optional(),
});

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

const validateCreateLiquidTemplateBody = validateYupSchema(createLiquidTemplateBody);

const validateGetHtmlTemplateBody = validateYupSchema(getHtmlTemplateBody);

const validateEmailSchema = validateYupSchema(emailSchema);

export { validateCreateLiquidTemplateBody, validateGetHtmlTemplateBody, validateEmailSchema };
