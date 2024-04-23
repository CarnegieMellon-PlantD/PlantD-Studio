import { expect, test } from '@jest/globals';

import { LoadPatternDTO } from '@/types/resourceManager/loadPattern';
import { getLoadPatternDTO, getLoadPatternVO } from './convertLoadPattern';

test('DTO->VO, Default', () => {
  const dtoIn: LoadPatternDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getLoadPatternVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    stages: [
      {
        id: expect.any(String),
        target: 0,
        duration: '',
      },
    ],
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: LoadPatternDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      stages: [
        {
          target: 100,
          duration: '10s',
        },
        {
          target: 200,
          duration: '20s',
        },
      ],
      preAllocatedVUs: 30,
      startRate: 0,
      timeUnit: '1s',
      maxVUs: 100,
    },
    status: {},
  };
  const vo = getLoadPatternVO(dtoIn);
  const dtoOut = getLoadPatternDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    stages: [
      {
        id: expect.any(String),
        target: 0,
        duration: '',
      },
      {
        id: expect.any(String),
        target: 100,
        duration: '10s',
      },
      {
        id: expect.any(String),
        target: 200,
        duration: '20s',
      },
    ],
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      stages: [
        {
          target: 100,
          duration: '10s',
        },
        {
          target: 200,
          duration: '20s',
        },
      ],
      preAllocatedVUs: 30,
      startRate: 0,
      timeUnit: '1s',
      maxVUs: 200,
    },
  });
});
