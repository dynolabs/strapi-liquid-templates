export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'liquidTemplate.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/count',
      handler: 'liquidTemplate.count',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/:id',
      handler: 'liquidTemplate.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/',
      handler: 'liquidTemplate.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: 'liquidTemplate.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: 'liquidTemplate.delete',
      config: {
        policies: [],
      },
    },
  ],
};
