import { expect, test } from '@jest/globals';

import { DigitalTwinDTO } from '@/types/resourceManager/digitalTwin';
import { getDigitalTwinDTO, getDigitalTwinVO } from './convertDigitalTwin';

test('DTO->VO, Default', () => {
  const dtoIn: DigitalTwinDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getDigitalTwinVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    modelType: '',
    digitalTwinType: 'regular',
    experiments: [],
    dataSet: {
      name: '',
    },
    pipeline: {
      name: '',
    },
    pipelineCapacity: 0,
  });
});

test('DTO->VO->DTO, Regular', () => {
  const dtoIn: DigitalTwinDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      modelType: 'model-type',
      digitalTwinType: 'regular',
      experiments: [
        {
          namespace: 'experiment-namespace',
          name: 'experiment-name',
        },
      ],
    },
    status: {},
  };
  const vo = getDigitalTwinVO(dtoIn);
  const dtoOut = getDigitalTwinDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    modelType: 'model-type',
    digitalTwinType: 'regular',
    experiments: [
      {
        namespace: 'experiment-namespace',
        name: 'experiment-name',
      },
    ],
    dataSet: {
      name: '',
    },
    pipeline: {
      name: '',
    },
    pipelineCapacity: 0,
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      modelType: 'model-type',
      digitalTwinType: 'regular',
      experiments: [
        {
          namespace: 'experiment-namespace',
          name: 'experiment-name',
        },
      ],
      dataSet: undefined,
      pipeline: undefined,
      pipelineCapacity: undefined,
    },
  });
});

test('DTO->VO->DTO, Schema-Aware', () => {
  const dtoIn: DigitalTwinDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      modelType: 'model-type',
      digitalTwinType: 'schemaaware',
      dataSet: {
        name: 'dataset-name',
      },
      pipeline: {
        name: 'pipeline-name',
      },
      pipelineCapacity: 10,
    },
    status: {},
  };
  const vo = getDigitalTwinVO(dtoIn);
  const dtoOut = getDigitalTwinDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    modelType: 'model-type',
    digitalTwinType: 'schemaaware',
    experiments: [],
    dataSet: {
      name: 'dataset-name',
    },
    pipeline: {
      name: 'pipeline-name',
    },
    pipelineCapacity: 10,
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      modelType: 'model-type',
      digitalTwinType: 'schemaaware',
      experiments: undefined,
      dataSet: {
        name: 'dataset-name',
      },
      pipeline: {
        name: 'pipeline-name',
      },
      pipelineCapacity: 10,
    },
  });
});
