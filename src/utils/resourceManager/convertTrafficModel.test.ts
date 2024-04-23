import { expect, test } from '@jest/globals';

import { TrafficModelDTO } from '@/types/resourceManager/trafficModel';
import { getTrafficModelDTO, getTrafficModelVO } from './convertTrafficModel';

test('DTO->VO, Default', () => {
  const dtoIn: TrafficModelDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getTrafficModelVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    config: '',
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: TrafficModelDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      config: 'config',
    },
    status: {},
  };
  const vo = getTrafficModelVO(dtoIn);
  const dtoOut = getTrafficModelDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    config: 'config',
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      config: 'config',
    },
  });
});
