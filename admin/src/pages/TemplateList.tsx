import {
  Table,
  Thead,
  Tr,
  Th,
  Typography,
  Tbody,
  Td,
  Flex,
  IconButton,
  Loader,
  useNotifyAT,
  Main,
  Button,
} from '@strapi/design-system';
import { Pencil, Plus, Trash } from '@strapi/icons';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useFetchClient,
  useNotification,
  Layouts,
  BackButton,
  ConfirmDialog,
  FetchError,
  useAPIErrorHandler,
} from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from 'react-query';
import { PLUGIN_ID } from '../pluginId';
import { SideNavBar } from '../components/SideNavBar';
import { getTranslation } from '../utils/getTranslation';
import { VisuallyHidden } from '@strapi/design-system';
import { Dialog } from '@strapi/design-system';
import { useState } from 'react';

type TEmailTemplate = {
  id: number;
  name: string;
  referenceId: string;
  enabled: boolean;
  createdAt: string;
};

const getUrl = (to: string) => (to ? `/plugins/${PLUGIN_ID}/${to}` : `/plugins/${PLUGIN_ID}`);

const getFetchUrl = (type?: string) => {
  if (type === 'base') {
    return `${PLUGIN_ID}/base-templates`;
  }
  return PLUGIN_ID;
};

const getDeleteUrl = (type?: string, id?: number) => {
  if (type === 'base') {
    return `${PLUGIN_ID}/base-templates/${id}`;
  }
  return `${PLUGIN_ID}/${id}`;
};

const getPageTitleId = (type?: string) => {
  if (type === 'base') {
    return 'label.baseTemplates';
  }
  return 'label.customTemplates';
};

const TemplateList = () => {
  const navigate = useNavigate();
  const { del, get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatDate, formatMessage } = useIntl();
  const { formatAPIError } = useAPIErrorHandler();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);

  const { notifyStatus } = useNotifyAT();

  const { type } = useParams();

  const getMessage = (id: string) => formatMessage({ id: getTranslation(id) });

  const emailTemplatesHeaders = [
    { name: getMessage('table.name'), value: 'name' },
    { name: getMessage('table.referenceId'), value: 'templateReferenceId' },
    { name: getMessage('table.createdAt'), value: 'createdAt' },
  ];

  const fetchTemplates = async (): Promise<TEmailTemplate[]> => {
    const url = getFetchUrl(type);

    const { data } = await get(url);

    return data;
  };

  const deleteTemplate = async (id: number) => {
    const url = getDeleteUrl(type, id);

    return del(url);
  };

  const {
    isLoading,
    data: emailTemplates,
    isFetching,
    refetch: refetchTemplate,
  } = useQuery({
    queryKey: ['get-liquid-templates', type],
    queryFn: () => fetchTemplates(),
    initialData: [],
    enabled: true,
    onError(error) {
      toggleNotification({
        type: 'danger',
        message: getMessage('notification.error'),
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (body: number) => deleteTemplate(body),
    onError(error) {
      toggleNotification({
        type: 'danger',
        message: formatAPIError(error as FetchError),
      });
    },
    async onSuccess() {
      toggleNotification({
        type: 'success',
        message: getMessage('label.templateDeleted'),
      });

      await refetchTemplate();
    },
  });

  const handleShowConfirmDelete = (id?: number) => {
    setShowConfirmDelete(!showConfirmDelete);
    setTemplateToDelete(id ?? null);
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      await deleteMutation.mutate(templateToDelete);
      setShowConfirmDelete(!showConfirmDelete);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Main>
      <Layouts.Root sideNav={<SideNavBar />}>
        <Layouts.Header
          id="title"
          title={getMessage(getPageTitleId(type))}
          navigationAction={<BackButton disabled={false} />}
          primaryAction={
            <Button startIcon={<Plus />} onClick={() => navigate(getUrl(`templates/${type}/new`))}>
              {getMessage('label.newTemplate')}
            </Button>
          }
        />

        <Layouts.Content>
          <Table colCount={emailTemplatesHeaders.length}>
            <Thead>
              <Tr>
                {emailTemplatesHeaders.map((header) => (
                  <Th key={header.value}>
                    <Typography variant="sigma">{header.name}</Typography>
                  </Th>
                ))}
                <Th>
                  <VisuallyHidden>{getMessage('table.actions')}</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {emailTemplates?.map((emailTemplate, index) => (
                <Tr key={emailTemplate.id}>
                  <Td>
                    <Typography textColor="neutral800">{emailTemplate.name}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">{emailTemplate.referenceId}</Typography>
                  </Td>
                  <Td>
                    <Typography textColor="neutral800">
                      {formatDate(new Date(emailTemplate.createdAt), {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </Typography>
                  </Td>
                  <Td>
                    <Flex justifyContent="end">
                      <IconButton
                        label={getMessage('label.edit')}
                        onClick={() => navigate(getUrl(`templates/${type}/${emailTemplate.id}`))}
                        variant="ghost"
                      >
                        <Pencil />
                      </IconButton>

                      <IconButton
                        label={getMessage('label.delete')}
                        onClick={() => handleShowConfirmDelete(emailTemplate.id)}
                        variant="ghost"
                      >
                        <Trash />
                      </IconButton>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Layouts.Content>
      </Layouts.Root>

      <Dialog.Root open={showConfirmDelete} onOpenChange={handleShowConfirmDelete}>
        <ConfirmDialog onConfirm={handleConfirmDelete} variant={undefined} icon={undefined} />
      </Dialog.Root>
    </Main>
  );
};

export { TemplateList };
