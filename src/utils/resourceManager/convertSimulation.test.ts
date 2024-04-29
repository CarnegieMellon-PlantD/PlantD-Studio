import { expect, test } from '@jest/globals';

import { SimulationDTO } from '@/types/resourceManager/simulation';
import { getSimulationDTO, getSimulationVO } from './convertSimulation';

test('DTO->VO, Default', () => {
  const dtoIn: SimulationDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getSimulationVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    hasDigitalTwin: false,
    digitalTwinRef: {
      namespace: '',
      name: '',
    },
    trafficModelRef: {
      namespace: '',
      name: '',
    },
    hasNetCost: false,
    netCostRef: {
      namespace: '',
      name: '',
    },
    scenarioRef: {
      namespace: '',
      name: '',
    },
  });
});

test('DTO->VO->DTO', () => {
  const dtoIn: SimulationDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      digitalTwinRef: {
        namespace: 'digitalTwinRef-namespace',
        name: 'digitalTwinRef-name',
      },
      trafficModelRef: {
        namespace: 'trafficModelRef-namespace',
        name: 'trafficModelRef-name',
      },
      netCostRef: {
        namespace: 'netCostRef-namespace',
        name: 'netCostRef-name',
      },
      scenarioRef: {
        namespace: 'scenarioRef-namespace',
        name: 'scenarioRef-name',
      },
    },
    status: {},
  };
  const vo = getSimulationVO(dtoIn);
  const dtoOut = getSimulationDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    hasDigitalTwin: true,
    digitalTwinRef: {
      namespace: 'digitalTwinRef-namespace',
      name: 'digitalTwinRef-name',
    },
    trafficModelRef: {
      namespace: 'trafficModelRef-namespace',
      name: 'trafficModelRef-name',
    },
    hasNetCost: true,
    netCostRef: {
      namespace: 'netCostRef-namespace',
      name: 'netCostRef-name',
    },
    scenarioRef: {
      namespace: 'scenarioRef-namespace',
      name: 'scenarioRef-name',
    },
  });
  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      digitalTwinRef: {
        namespace: 'digitalTwinRef-namespace',
        name: 'digitalTwinRef-name',
      },
      trafficModelRef: {
        namespace: 'trafficModelRef-namespace',
        name: 'trafficModelRef-name',
      },
      netCostRef: {
        namespace: 'netCostRef-namespace',
        name: 'netCostRef-name',
      },
      scenarioRef: {
        namespace: 'scenarioRef-namespace',
        name: 'scenarioRef-name',
      },
    },
  });
});
