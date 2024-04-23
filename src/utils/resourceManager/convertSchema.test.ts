import { expect, test } from '@jest/globals';

import { SchemaDTO } from '@/types/resourceManager/schema';
import { getSchemaDTO, getSchemaVO } from './convertSchema';

test('DTO->VO, Default', () => {
  const dtoIn: SchemaDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getSchemaVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    columns: [],
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: SchemaDTO = {
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
            name: 'Copy',
            args: ['arg1'],
          },
        },
      ],
    },
    status: {},
  };
  const vo = getSchemaVO(dtoIn);
  const dtoOut = getSchemaDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    columns: [
      {
        id: expect.any(String),
        name: 'column-name',
        type: 'creditcardnumber',
        params: expect.arrayContaining([
          {
            info: expect.any(Object),
            value: 'bins-value',
          },
        ]),
        formula: 'Copy',
        args: {
          info: 'anyColumn',
          value: ['arg1'],
        },
      },
    ],
  });

  expect(dtoOut).toStrictEqual({
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
            name: 'Copy',
            args: ['arg1'],
          },
        },
      ],
    },
  });
});
