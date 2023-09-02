import { expect, test } from '@jest/globals';

import { getSchemaDTO, getSchemaVO } from './convertSchema';

test('DTO->VO', () => {
  expect(
    getSchemaVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        columns: [
          {
            name: 'column-name',
            type: 'creditcardnumber',
            params: {
              bins: 'bins-value',
            },
            formula: {
              name: 'AddInt',
              args: ['arg'],
            },
          },
        ],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    columns: [
      {
        id: expect.any(String),
        name: 'column-name',
        type: 'creditcardnumber',
        params: [
          {
            info: expect.objectContaining({
              field: 'types',
            }),
            value: '',
          },
          {
            info: expect.objectContaining({
              field: 'bins',
            }),
            value: 'bins-value',
          },
          {
            info: expect.objectContaining({
              field: 'gaps',
            }),
            value: '',
          },
        ],
        formula: 'AddInt',
        args: {
          info: 'intColumnList',
          value: ['arg'],
        },
      },
    ],
  });
});

test('DTO->VO (fallback values)', () => {
  // All empty
  expect(
    getSchemaVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {},
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    columns: [],
  });

  // One empty column
  expect(
    getSchemaVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        columns: [{}],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    columns: [
      {
        id: expect.any(String),
        name: '',
        type: '',
        params: [],
        formula: '',
        args: {
          info: 'null',
          value: [],
        },
      },
    ],
  });
});

test('VO->DTO', () => {
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: 'column-type',
          params: [
            {
              info: { field: 'param-0' } as never,
              value: 'value-0',
            },
            {
              info: { field: 'param-1' } as never,
              value: 'value-1',
            },
          ],
          formula: 'column-formula',
          args: {
            info: 'intColumnList',
            value: ['arg'],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: 'column-type',
          params: {
            'param-0': 'value-0',
            'param-1': 'value-1',
          },
          formula: {
            name: 'column-formula',
            args: ['arg'],
          },
        },
      ],
    },
  });
});

test('VO->DTO (empty type and formula)', () => {
  // Empty `type` should result in omitting `type` and `params`
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: '',
          params: [
            {
              info: { field: 'param-0' } as never,
              value: 'value-0',
            },
            {
              info: { field: 'param-1' } as never,
              value: 'value-1',
            },
          ],
          formula: '',
          args: {
            info: 'null',
            value: [],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: undefined,
          params: undefined,
          formula: undefined,
        },
      ],
    },
  });

  // Empty `formula` should result in omitting `formula` and `args`
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: '',
          params: [],
          formula: '',
          args: {
            info: 'null',
            value: ['arg'],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: undefined,
          params: undefined,
          formula: undefined,
        },
      ],
    },
  });
});

test('VO->DTO (empty params and empty param values)', () => {
  // When `params` are empty, it should be omitted
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: 'column-type',
          params: [],
          formula: '',
          args: {
            info: 'null',
            value: [],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: 'column-type',
          params: undefined,
          formula: undefined,
        },
      ],
    },
  });

  // Params with empty values should be omitted
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: 'column-type',
          params: [
            {
              info: { field: 'param-0' } as never,
              value: 'value-0',
            },
            {
              info: { field: 'param-1' } as never,
              value: '',
            },
          ],
          formula: '',
          args: {
            info: 'null',
            value: [],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: 'column-type',
          params: {
            'param-0': 'value-0',
          },
          formula: undefined,
        },
      ],
    },
  });

  // When all params have empty values, `params` should be omitted
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: 'column-type',
          params: [
            {
              info: { field: 'param-0' } as never,
              value: '',
            },
            {
              info: { field: 'param-1' } as never,
              value: '',
            },
          ],
          formula: '',
          args: {
            info: 'null',
            value: [],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: 'column-type',
          params: undefined,
          formula: undefined,
        },
      ],
    },
  });
});

test('VO->DTO (empty args)', () => {
  // When `args` are empty, it should be omitted
  expect(
    getSchemaDTO({
      namespace: 'namespace',
      name: 'name',
      columns: [
        {
          id: 'column-id',
          name: 'column-name',
          type: '',
          params: [],
          formula: 'column-formula',
          args: {
            info: 'null',
            value: [],
          },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      columns: [
        {
          name: 'column-name',
          type: undefined,
          params: undefined,
          formula: {
            name: 'column-formula',
            args: undefined,
          },
        },
      ],
    },
  });
});
