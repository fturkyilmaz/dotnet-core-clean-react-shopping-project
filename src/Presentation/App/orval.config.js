module.exports = {
  api: {
    input: 'http://localhost:5000/swagger/v1/swagger.json',
    output: {
      target: 'src/infrastructure/api/generated.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
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
      },
    },
  },
};
