import { expect, test } from '@jest/globals';

import { PlantDCoreDTO } from '@/types/resourceManager/plantDCore';
import { getPlantDCoreDTO, getPlantDCoreVO } from './convertPlantDCore';

test('DTO->VO, Default', () => {
  const dtoIn: PlantDCoreDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getPlantDCoreVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    enableThanos: false,
    thanosObjectStoreConfig: {
      name: '',
      key: '',
    },
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: PlantDCoreDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      thanos: {
        objectStoreConfig: {
          name: 'name',
          key: 'key',
        },
      },
    },
    status: {},
  };
  const vo = getPlantDCoreVO(dtoIn);
  const dtoOut = getPlantDCoreDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    enableThanos: true,
    thanosObjectStoreConfig: {
      name: 'name',
      key: 'key',
    },
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      thanos: {
        objectStoreConfig: {
          name: 'name',
          key: 'key',
        },
      },
    },
  });
});
