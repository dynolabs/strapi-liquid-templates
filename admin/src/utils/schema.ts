import * as yup from 'yup';

const liquidTemplateSchema = yup.object().shape({
  referenceId: yup
    .string()
    .required('input.referenceId.error')
    .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'input.referenceId.error.format'),
  name: yup.string().required('input.name.error'),
  subject: yup.string().optional(),
  bodyHtml: yup.string().required('input.bodyHtml.error'),
  // sampleData is a valid JSON string
  sampleData: yup
    .string()
    .notRequired()
    .test('is-json', 'input.sampleData.error', (value) => {
      if (!value) return true;
      if (typeof value === 'string' && value.length === 0) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
  bodyText: yup.string().optional(),
});

export { liquidTemplateSchema };
