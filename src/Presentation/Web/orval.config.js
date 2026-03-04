module.exports = {
  api: {
    input: 'http://localhost:5000/swagger/v1/swagger.json',
    output: {
      target: 'src/infrastructure/api/generated',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        // Use custom axios instance with interceptors
        mutator: {
          path: 'src/infrastructure/api/httpClient.ts',
          name: 'httpClient',
          default: false,
        },
        operations: {
          GetApiV1ProductsPaged: {
            operationName: 'GetProductsPaged',
          },
          PostApiV1ProductsSearch: {
            operationName: 'SearchProducts',
          },
        },
        schemas: {
          Int32ServiceResult: {
            name: 'ServiceResult',
          },
        },
        // Transform response to return data directly
        requestOptions: {
          transformResponse: true,
        },
      },
    },
  },
};
