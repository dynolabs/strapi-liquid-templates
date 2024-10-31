import { Page } from '@strapi/strapi/admin';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { HomePage } from './HomePage';
import { PLUGIN_ID } from '../pluginId';
import { EditTemplatePage } from './EditTemplatePage';
import { TemplateList } from './TemplateList';
import { CoreTemplateList } from './CoreTemplateList';
import { CreateTemplatePage } from './CreateTemplatePage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route index element={<Navigate to="templates/base" />} />
        <Route path="templates/core" element={<CoreTemplateList />} />
        <Route path="templates/:type" element={<TemplateList />} />
        <Route path="templates/:type/new" element={<CreateTemplatePage />} />
        <Route path="templates/:type/:templateId" element={<EditTemplatePage />} />
        <Route path="*" element={<Page.Error />} />
      </Routes>
    </QueryClientProvider>
  );
};

export { App };
