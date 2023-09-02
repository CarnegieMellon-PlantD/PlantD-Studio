import { expect, test } from '@jest/globals';

import { getNamespaceDTO, getNamespaceVO } from './convertNamespace';

test('DTO->VO', () => {
  expect(
    getNamespaceVO({
      metadata: {
        name: 'name',
      },
      spec: {},
      status: {},
    })
  ).toStrictEqual({
    name: 'name',
  });
});

test('VO->DTO', () => {
  expect(
    getNamespaceDTO({
      name: 'name',
    })
  ).toStrictEqual({
    metadata: {
      name: 'name',
    },
  });
});
