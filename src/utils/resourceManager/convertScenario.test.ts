import { expect, test } from '@jest/globals';

import { ScenarioDTO } from '@/types/resourceManager/scenario';
import { getScenarioDTO, getScenarioVO } from './convertScenario';

test('DTO->VO, Default', () => {
  const dtoIn: ScenarioDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getScenarioVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    tasks: [],
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: ScenarioDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      tasks: [
        {
          name: 'task-name',
          size: 'task-size',
          sendingDevices: {
            min: 1,
            max: 2,
          },
          pushFrequencyPerMonth: {
            min: 3,
            max: 4,
          },
          monthsRelevant: [5, 6],
        },
      ],
    },
    status: {},
  };
  const vo = getScenarioVO(dtoIn);
  const dtoOut = getScenarioDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    tasks: [
      {
        id: expect.any(String),
        name: 'task-name',
        size: 'task-size',
        sendingDevices: {
          min: 1,
          max: 2,
        },
        pushFrequencyPerMonth: {
          min: 3,
          max: 4,
        },
        monthsRelevant: [5, 6],
      },
    ],
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      tasks: [
        {
          name: 'task-name',
          size: 'task-size',
          sendingDevices: {
            min: 1,
            max: 2,
          },
          pushFrequencyPerMonth: {
            min: 3,
            max: 4,
          },
          monthsRelevant: [5, 6],
        },
      ],
    },
  });
});
