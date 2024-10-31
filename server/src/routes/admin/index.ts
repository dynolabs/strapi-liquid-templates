export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/base-templates',
      handler: 'liquidBaseTemplate.find',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'POST',
      path: '/base-templates',
      handler: 'liquidBaseTemplate.create',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'GET',
      path: '/base-templates/:id',
      handler: 'liquidBaseTemplate.findOne',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'PUT',
      path: '/base-templates/:id',
      handler: 'liquidBaseTemplate.update',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'DELETE',
      path: '/base-templates/:id',
      handler: 'liquidBaseTemplate.delete',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'GET',
      path: '/',
      handler: 'liquidTemplate.find',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'POST',
      path: '/',
      handler: 'liquidTemplate.create',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'GET',
      path: '/count',
      handler: 'liquidTemplate.count',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'GET',
      path: '/:id',
      handler: 'liquidTemplate.findOne',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: 'liquidTemplate.update',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: 'liquidTemplate.delete',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'POST',
      path: '/html',
      handler: 'liquidTemplate.getHtmlTemplate',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'POST',
      path: '/send-email',
      handler: 'liquidTemplate.sendEmail',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'GET',
      path: '/core-templates/:id',
      handler: 'coreTemplate.findOne',
      config: {
        policies: ['admin'],
      },
    },
    {
      method: 'PUT',
      path: '/core-templates/:id',
      handler: 'coreTemplate.update',
      config: {
        policies: ['admin'],
      },
    },
  ],
};
