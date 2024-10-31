import { Box } from '@strapi/design-system';
import { Page as StrapiPage } from '@strapi/strapi/admin';

const Error = ({ statusCode }: { statusCode: number }) => {
  switch (statusCode) {
    case 404:
      return (
        <Box height="100vh">
          <StrapiPage.NoData />
        </Box>
      );
    case 403:
      return (
        <Box height="100vh">
          <StrapiPage.NoPermissions />
        </Box>
      );
    default:
      return (
        <Box height="100vh">
          <StrapiPage.Error />
        </Box>
      );
  }
};

const Page = {
  Title: StrapiPage.Title,
  Main: StrapiPage.Main,
  Loading: StrapiPage.Loading,
  Error: Error,
};

export { Page };
