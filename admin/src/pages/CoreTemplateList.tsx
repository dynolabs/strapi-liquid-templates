import { useNavigate } from 'react-router-dom';

import {
  Flex,
  IconButton,
  Main,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden,
} from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { BackButton, Layouts } from '@strapi/strapi/admin';

import { SideNavBar } from '../components/SideNavBar';
import { PLUGIN_ID } from '../pluginId';
import { getMessage } from '../utils/getMessage';

const getUrl = (to: string) => (to ? `/plugins/${PLUGIN_ID}/${to}` : `/plugins/${PLUGIN_ID}`);

const CoreTemplateList = () => {
  const navigate = useNavigate();

  const tableHeaders = [{ name: getMessage('table.name'), value: 'name' }];

  const emailTemplates = [
    {
      id: 1,
      referenceId: 'email-confirmation',
      name: getMessage('core.emailTypes.confirmation'),
    },
    {
      id: 2,
      referenceId: 'reset-password',
      name: getMessage('core.emailTypes.resetPassword'),
    },
  ];

  return (
    <Main>
      <Layouts.Root sideNav={<SideNavBar />}>
        <Layouts.Header
          id="title"
          title={getMessage('label.coreTemplates')}
          navigationAction={<BackButton disabled={false} />}
        />

        <Layouts.Content>
          <Table colCount={tableHeaders.length}>
            <Thead>
              <Tr>
                {tableHeaders.map((header) => (
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
                    <Flex justifyContent="end">
                      <IconButton
                        label={getMessage('label.edit')}
                        onClick={() =>
                          navigate(getUrl(`templates/core/${emailTemplate.referenceId}`))
                        }
                        variant="ghost"
                      >
                        <Pencil />
                      </IconButton>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Layouts.Content>
      </Layouts.Root>
    </Main>
  );
};

export { CoreTemplateList };
