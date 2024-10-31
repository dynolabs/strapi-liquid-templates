import { ChangeEvent, useState } from 'react';
import {
  Main,
  Flex,
  Box,
  TextInput,
  Textarea,
  Button,
  Field,
  IconButton,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import {
  BackButton,
  FetchError,
  Layouts,
  Page,
  useAPIErrorHandler,
  useFetchClient,
  useNotification,
} from '@strapi/strapi/admin';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import { Check, Expand } from '@strapi/icons';
import { useMutation, useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { liquidTemplateSchema } from '../utils/schema';
import { PLUGIN_ID } from '../pluginId';
import { TemplatePreviewModal } from '../components/TemplatePreviewModal';
import { getTranslation } from '../utils/getTranslation';
import { VisuallyHidden } from '@strapi/design-system';
import { JSONInput } from '@strapi/design-system';

const TemplateBodyField = styled(Field.Root)`
  & > div {
    height: inherit;
  }
`;

const ExpandButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
`;

const Iframe = styled.iframe`
  color: ${({ theme }) => theme.colors.neutral400};
  border: none;
`;

const getBaseTemplate = (
  baseTemplates: { id: number; referenceId: string; bodyHtml: string }[],
  selectedBaseTemplate: number
) => {
  console.log(selectedBaseTemplate, baseTemplates);
  return baseTemplates?.find((baseTemplate) => baseTemplate.id === selectedBaseTemplate);
};

const getPageTitleId = (type?: string) => {
  if (type === 'base') {
    return 'label.createBaseTemplate';
  }
  return 'label.createCustomTemplate';
};

const CreateTemplatePage = () => {
  const { type } = useParams();
  const { put, get, post } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatAPIError } = useAPIErrorHandler();

  const { formatMessage } = useIntl();

  const [htmlPreview, setHtmlPreview] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const getMessage = (id: string) => formatMessage({ id: getTranslation(id) });

  const isBaseTemplate = type === 'base';

  const fetchBaseTemplates = async () => {
    const { data } = await get(`${PLUGIN_ID}/base-templates`);

    return data;
  };

  const createTemplate = (data: any, templateType?: string) => {
    const url = templateType === 'base' ? `${PLUGIN_ID}/base-templates` : `${PLUGIN_ID}`;

    return post(url, data);
  };

  const {
    data: baseTemplates,
    isLoading: isLoadingBaseTemplates,
    refetch: refetchBaseTemplates,
  } = useQuery({
    queryKey: ['get-base-templates'],
    queryFn: () => fetchBaseTemplates(),
    onError(error) {
      toggleNotification({
        type: 'danger',
        message: formatAPIError(error as FetchError),
      });
    },
    enabled: !isBaseTemplate,
  });

  const fetchTemplatePreview = ({
    data,
    sampleData,
    baseTemplate,
  }: {
    data: string;
    sampleData: string;
    baseTemplate: { bodyHtml: string; referenceId: string };
  }) => {
    return post(`${PLUGIN_ID}/html`, {
      template: data,
      sampleData,
      baseTemplate: baseTemplate,
    });
  };

  const mutation = useMutation((body) => createTemplate(body, type), {
    onError(error) {
      console.error(error);
      toggleNotification({
        type: 'danger',
        message: formatAPIError(error as FetchError),
      });
    },
    async onSuccess() {
      toggleNotification({
        type: 'success',
        message: getMessage('label.templateCreated'),
      });
    },
  });

  const mutationHtmlPreview = useMutation({
    mutationFn: (payload: any) => fetchTemplatePreview(payload),
    onError(error) {
      toggleNotification({
        type: 'danger',
        message: formatAPIError(error as FetchError),
      });
    },
    async onSuccess(result) {
      setHtmlPreview(result.data.html);
    },
  });

  const handleCreateTemplate = async (data: any) => {
    await mutation.mutate(data);
  };

  const handleTogglePreviewModal = (status: boolean) => {
    setIsPreviewModalOpen(status);
  };

  const handleGetHtmlPreview = async ({
    data,
    sampleData,
    baseTemplate,
  }: {
    data: string;
    sampleData: string;
    baseTemplate?: { bodyHtml: string; referenceId: string };
  }) => {
    if (data) {
      await mutationHtmlPreview.mutate({
        data: data,
        baseTemplate,
        sampleData,
      });
    } else {
      setHtmlPreview('');
    }
  };

  return (
    <Main>
      <Page.Title>{getMessage(getPageTitleId(type))}</Page.Title>

      <Formik
        enableReinitialize
        initialValues={{
          referenceId: '',
          name: '',
          subject: '',
          bodyHtml: '',
          baseTemplate: null,
        }}
        onSubmit={handleCreateTemplate}
        validationSchema={liquidTemplateSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ handleSubmit, values, handleChange, errors, validateField }: any) => {
          const baseTemplate = getBaseTemplate(baseTemplates, values.baseTemplate);

          console.log(baseTemplate);
          // Avoid a race condition to allow each field to be validated on change
          const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
            handleChange(e);
            validateField(e.target.name);
          };

          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Layouts.Header
                id="title"
                title={getMessage(getPageTitleId(type))}
                navigationAction={<BackButton disabled={false} />}
                primaryAction={
                  <Button type="submit" loading={mutation.isLoading} startIcon={<Check />}>
                    {getMessage('label.save')}
                  </Button>
                }
              ></Layouts.Header>

              <Layouts.Content>
                <Flex
                  background="neutral0"
                  direction="column"
                  alignItems="stretch"
                  gap={7}
                  hasRadius
                  paddingTop={6}
                  paddingBottom={6}
                  paddingLeft={7}
                  paddingRight={7}
                  shadow="filterShadow"
                >
                  <Flex direction="row" gap={4} justifyContent="stretch">
                    <Field.Root
                      id="referenceId"
                      hint={getMessage('input.referenceId.hint')}
                      error={errors?.referenceId ? getMessage('input.referenceId.error') : false}
                      required
                      flex="1"
                    >
                      <Field.Label>{getMessage('input.referenceId.label')}</Field.Label>
                      <TextInput
                        placeholder={getMessage('input.referenceId.placeholder')}
                        name="referenceId"
                        value={values.referenceId}
                        onChange={handleInputChange}
                      />
                      <Field.Error />
                      <Field.Hint />
                    </Field.Root>

                    <Field.Root
                      id="name"
                      hint={getMessage('input.name.hint')}
                      error={errors?.name ? getMessage('input.name.error') : false}
                      required
                      flex="1"
                    >
                      <Field.Label>{getMessage('input.name.label')}</Field.Label>
                      <TextInput
                        placeholder={getMessage('input.name.placeholder')}
                        name="name"
                        value={values.name}
                        onChange={handleInputChange}
                      />
                      <Field.Error />
                      <Field.Hint />
                    </Field.Root>

                    {!isBaseTemplate && (
                      <Field.Root id="subject" hint={getMessage('input.subject.hint')} flex="1">
                        <Field.Label>{getMessage('input.subject.label')}</Field.Label>
                        <TextInput
                          placeholder={getMessage('input.subject.placeholder')}
                          name="subject"
                          value={values.subject}
                          onChange={handleInputChange}
                        />
                        <Field.Error />
                        <Field.Hint />
                      </Field.Root>
                    )}

                    {!isBaseTemplate && (
                      <Field.Root
                        flex="1"
                        id="baseTemplate"
                        hint={getMessage('input.baseTemplate.hint')}
                      >
                        <Field.Label>{getMessage('input.baseTemplate.label')}</Field.Label>
                        <SingleSelect
                          name="baseTemplate"
                          placeholder={getMessage('input.baseTemplate.placeholder')}
                          value={values.baseTemplate}
                          onChange={(value: string) => {
                            handleChange({
                              target: {
                                name: 'baseTemplate',
                                value: Number(value),
                              },
                            });
                          }}
                          onClear={() => {
                            handleChange({
                              target: {
                                name: 'baseTemplate',
                                value: null,
                              },
                            });
                          }}
                        >
                          {baseTemplates?.map((baseTemplate: any) => (
                            <SingleSelectOption key={baseTemplate.id} value={baseTemplate.id}>
                              {baseTemplate.referenceId}
                            </SingleSelectOption>
                          ))}
                        </SingleSelect>
                        <Field.Error />
                        <Field.Hint />
                      </Field.Root>
                    )}
                  </Flex>

                  <Flex direction="row" justifyContent="stretch" alignItems="stretch" gap={4}>
                    <Flex flex="1">
                      <TemplateBodyField
                        id="bodyHtml"
                        hint={getMessage('input.bodyHtml.hint')}
                        flex="1"
                        error={errors?.bodyHtml ? getMessage('input.bodyHtml.error') : false}
                        required
                      >
                        <Field.Label>{getMessage('input.bodyHtml.label')}</Field.Label>
                        <Textarea
                          placeholder={getMessage('input.bodyHtml.placeholder')}
                          name="bodyHtml"
                          rows={20}
                          value={values.bodyHtml}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            handleInputChange(e);
                            handleGetHtmlPreview({
                              data: e.target.value,
                              sampleData: values.sampleData,
                              baseTemplate: baseTemplate,
                            });
                          }}
                        />
                        <Field.Error />
                        <Field.Hint />
                      </TemplateBodyField>
                    </Flex>

                    <Flex flex="1" alignItems="stretch" direction="column">
                      <Field.Root flex="1" hint={getMessage('input.preview.hint')} readOnly>
                        <Field.Label>{getMessage('input.preview.label')}</Field.Label>

                        <Box
                          flex="1"
                          borderColor="neutral200"
                          background="neutral800"
                          position="relative"
                        >
                          <ExpandButton
                            onClick={() => handleTogglePreviewModal(true)}
                            type="button"
                          >
                            <Expand />
                          </ExpandButton>

                          <Iframe srcDoc={htmlPreview} height="100%" width="100%" />
                        </Box>
                        <Field.Hint />
                      </Field.Root>
                    </Flex>
                  </Flex>

                  <Flex>
                    <Flex flex="1">
                      <VisuallyHidden />
                    </Flex>

                    <Flex flex="1">
                      <Field.Root
                        id="sampleData"
                        hint={getMessage('input.sampleData.hint')}
                        flex="1"
                        error={errors?.sampleData ? getMessage('input.sampleData.error') : false}
                      >
                        <Field.Label>{getMessage('input.sampleData.label')}</Field.Label>
                        <JSONInput
                          placeholder={getMessage('input.sampleData.placeholder')}
                          name="sampleData"
                          rows={20}
                          value={values.sampleData}
                          onChange={(value: string) => {
                            handleInputChange({
                              target: {
                                name: 'sampleData',
                                value,
                              },
                            } as ChangeEvent<HTMLInputElement>);
                            handleGetHtmlPreview({
                              data: values.bodyHtml,
                              sampleData: value,
                              baseTemplate: baseTemplate,
                            });
                          }}
                        />
                        <Field.Error />
                        <Field.Hint />
                      </Field.Root>
                    </Flex>
                  </Flex>
                </Flex>
              </Layouts.Content>
            </Form>
          );
        }}
      </Formik>

      <TemplatePreviewModal
        isOpen={isPreviewModalOpen}
        onToggle={handleTogglePreviewModal}
        content={htmlPreview}
      />
    </Main>
  );
};

export { CreateTemplatePage };
