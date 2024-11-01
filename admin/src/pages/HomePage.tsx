import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Flex,
  IconButton,
  Loader,
  Main,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  useNotifyAT,
} from '@strapi/design-system';
import { Pencil, Plus } from '@strapi/icons';
import { BackButton, Layouts, useFetchClient, useNotification } from '@strapi/strapi/admin';

import { SideNavBar } from '../components/SideNavBar';
import { PLUGIN_ID } from '../pluginId';
import { getMessage } from '../utils/getMessage';

type TEmailTemplate = {
  id: number;
  name: string;
  referenceId: string;
  enabled: boolean;
  createdAt: string;
};

const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

const getUrl = (to: string) => (to ? `/plugins/${PLUGIN_ID}/${to}` : `/plugins/${PLUGIN_ID}`);

const HomePage = () => {
  const navigate = useNavigate();
  const { del, get } = useFetchClient();
  const { toggleNotification } = useNotification();
  const { formatDate } = useIntl();

  const { notifyStatus } = useNotifyAT();

  const {
    isLoading: isLoadingTemplates,
    data: emailTemplates,
    isFetching,
    refetch,
  } = useQuery('get-liquid-templates', () => fetchTemplates(), {
    initialData: [],
    enabled: true,
  });

  const emailTemplatesHeaders = [
    { name: getMessage('table.name'), value: 'name' },
    { name: getMessage('table.template-reference-id'), value: 'templateReferenceId' },
    { name: getMessage('table.enabled'), value: 'enabled' },
    { name: getMessage('table.created-at'), value: 'createdAt' },
  ];

  const coreTemplatesHeaders = [{ name: getMessage('table.name'), value: 'name' }];
  const coreEmailTypes = [
    {
      coreEmailType: 'email-confirmation',
      name: getMessage('email-confirmation'),
    },
    {
      coreEmailType: 'reset-password',
      name: getMessage('reset-password'),
    },
  ];

  const fetchTemplates = async (): Promise<TEmailTemplate[]> => {
    try {
      const { data } = await get(`${PLUGIN_ID}`);
      notifyStatus('The roles have loaded successfully');

      return data;
    } catch (err: any) {
      toggleNotification({
        type: 'danger',
        message: getMessage('notification.error'),
      });

      throw new Error(err);
    }
  };

  return (
    <Main>
      <Layouts.Root sideNav={<SideNavBar />}>
        <Layouts.Header
          id="title"
          title={getMessage('plugin.name')}
          subtitle={getMessage('plugin.description')}
          navigationAction={<BackButton disabled={false} />}
          primaryAction={
            <Button startIcon={<Plus />} onClick={() => navigate(getUrl('design/new'))}>
              {getMessage('label.newTemplate')}
            </Button>
          }
        ></Layouts.Header>

        <Layouts.Content>
          <Flex direction="column" alignItems="stretch" gap={4}>
            <Tabs.Root defaultValue="custom">
              <Tabs.List aria-label="Email template types">
                <Tabs.Trigger value="custom">{getMessage('custom-email-templates')}</Tabs.Trigger>
                <Tabs.Trigger value="core">{getMessage('core-email-templates')}</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="custom">
                {isLoadingTemplates ? (
                  <Loader />
                ) : (
                  <Table colCount={emailTemplatesHeaders.length}>
                    <Thead>
                      <Tr>
                        {emailTemplatesHeaders.map((header) => (
                          <Th key={header.value}>
                            <Typography variant="sigma">{header.name}</Typography>
                          </Th>
                        ))}
                        <Th>
                          <Typography variant="sigma">{getMessage('table.actions')}</Typography>
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
                            <Typography textColor="neutral800">
                              {emailTemplate.referenceId}
                            </Typography>
                          </Td>
                          <Td>
                            <Typography textColor="neutral800">{emailTemplate.enabled}</Typography>
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
                            <Flex>
                              <IconButton
                                label={getMessage('tooltip.edit')}
                                onClick={() => navigate(getUrl(`design/${emailTemplate.id}`))}
                                noBorder
                              >
                                <Pencil />
                              </IconButton>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Tabs.Content>

              <Tabs.Content value="core">
                <Table colCount={coreTemplatesHeaders.length}>
                  <Thead>
                    <Tr>
                      {coreTemplatesHeaders.map((header) => (
                        <Th key={header.value}>
                          <Typography variant="sigma">{header.name}</Typography>
                        </Th>
                      ))}
                      <Th>
                        <Typography variant="sigma">{getMessage('table.actions')}</Typography>
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {coreEmailTypes.map((coreEmailType, index) => (
                      <Tr key={coreEmailType.name}>
                        <Td>
                          <Typography textColor="neutral800">{coreEmailType.name}</Typography>
                        </Td>
                        <Td>
                          <Flex>
                            <IconButton
                              label={getMessage('tooltip.edit')}
                              onClick={() =>
                                navigate(getUrl(`design/core/${coreEmailType.coreEmailType}`))
                              }
                              noBorder
                            >
                              <Pencil />
                            </IconButton>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Tabs.Content>
            </Tabs.Root>
          </Flex>
        </Layouts.Content>
      </Layouts.Root>
    </Main>
  );
};

export { HomePage };
