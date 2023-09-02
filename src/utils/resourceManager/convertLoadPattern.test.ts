import { expect, test } from '@jest/globals';

import { getLoadPatternDTO, getLoadPatternVO } from './convertLoadPattern';

test('DTO->VO', () => {
  expect(
    getLoadPatternVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        stages: [
          {
            target: 100,
            duration: '120s',
          },
        ],
        preAllocatedVUs: 30,
        startRate: 0,
        maxVUs: 100,
        timeUnit: '1s',
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    stages: [
      {
        id: expect.any(String),
        target: 0,
        duration: 0,
        durationUnit: '',
      },
      {
        id: expect.any(String),
        target: 100,
        duration: 120,
        durationUnit: 's',
      },
    ],
  });
});

test('DTO->VO (fallback values)', () => {
  expect(
    getLoadPatternVO({
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
    stages: [
      {
        id: expect.any(String),
        target: 0,
        duration: 0,
        durationUnit: '',
      },
    ],
  });
});

test('VO -> DTO', () => {
  expect(
    getLoadPatternDTO({
      namespace: 'namespace',
      name: 'name',
      stages: [
        {
          id: 'stage-id-0',
          target: 0,
          duration: 0,
          durationUnit: '',
        },
        {
          id: 'stage-id-1',
          target: 100,
          duration: 120,
          durationUnit: 's',
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      stages: [
        {
          target: 100,
          duration: '120s',
        },
      ],
      preAllocatedVUs: 30,
      startRate: 0,
      maxVUs: 100,
      timeUnit: '1s',
    },
  });
});
