import { QueryClient, QueryClientProvider } from 'react-query';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Page } from '@strapi/strapi/admin';

import { CoreTemplateList } from './CoreTemplateList';
import { CreateTemplatePage } from './CreateTemplatePage';
import { EditTemplatePage } from './EditTemplatePage';
import { TemplateList } from './TemplateList';

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
