import { expect, test } from '@jest/globals';

import { NamespaceDTO } from '@/types/resourceManager/namespace';
import { getNamespaceDTO, getNamespaceVO } from './convertNamespace';

test('DTO->VO->DTO', () => {
  const dtoIn: NamespaceDTO = {
    metadata: {
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getNamespaceVO(dtoIn);
  const dtoOut = getNamespaceDTO(vo);

  expect(vo).toStrictEqual({
    name: 'name',
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      name: 'name',
    },
  });
});
