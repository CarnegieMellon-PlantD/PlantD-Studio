import { expect, test } from '@jest/globals';

import { ExperimentDTO, ExperimentVO } from '@/types/resourceManager/experiment';
import { getExperimentDTO, getExperimentVO } from './convertExperiment';

test('DTO->VO, Default', () => {
  const dtoIn: ExperimentDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getExperimentVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      name: '',
    },
    endpointSpecs: [],
    hasScheduledTime: false,
    scheduledTime: '',
    drainingMode: 'none',
    drainingTime: '',
  });
});

test('DTO->VO->DTO, PlainText', () => {
  const dtoIn: ExperimentDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      k6RunnerImage: 'k6-runner-image',
      k6StarterImage: 'k6-starter-image',
      k6InitializerImage: 'k6-initializer-image',
      pipelineRef: {
        name: 'pipeline-name',
      },
      endpointSpecs: [
        {
          endpointName: 'endpoint-name',
          dataSpec: {
            plainText: 'plain-text',
          },
          loadPatternRef: {
            namespace: 'load-pattern-namespace',
            name: 'load-pattern-name',
          },
        },
      ],
    },
    status: {},
  };
  const vo = getExperimentVO(dtoIn);
  const dtoOut = getExperimentDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      name: 'pipeline-name',
    },
    endpointSpecs: [
      {
        endpointName: 'endpoint-name',
        dataSpec: {
          option: 'plainText',
          plainText: 'plain-text',
          dataSetRef: {
            name: '',
          },
        },
        loadPatternRef: {
          namespace: 'load-pattern-namespace',
          name: 'load-pattern-name',
        },
        storageSize: '',
      },
    ],
    hasScheduledTime: false,
    scheduledTime: '',
    drainingMode: 'none',
    drainingTime: '',
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      k6RunnerImage: 'k6-runner-image',
      k6StarterImage: 'k6-starter-image',
      k6InitializerImage: 'k6-initializer-image',
      pipelineRef: {
        name: 'pipeline-name',
      },
      endpointSpecs: [
        {
          endpointName: 'endpoint-name',
          dataSpec: {
            plainText: 'plain-text',
            dataSetRef: undefined,
          },
          loadPatternRef: {
            namespace: 'load-pattern-namespace',
            name: 'load-pattern-name',
          },
          storageSize: undefined,
        },
      ],
      scheduledTime: undefined,
      drainingTime: undefined,
      useEndDetection: undefined,
    },
  });
});

test('DTO->VO->DTO, DataSet', () => {
  const dtoIn: ExperimentDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      k6RunnerImage: 'k6-runner-image',
      k6StarterImage: 'k6-starter-image',
      k6InitializerImage: 'k6-initializer-image',
      pipelineRef: {
        name: 'pipeline-name',
      },
      endpointSpecs: [
        {
          endpointName: 'endpoint-name',
          dataSpec: {
            dataSetRef: {
              name: 'data-set-name',
            },
          },
          loadPatternRef: {
            namespace: 'load-pattern-namespace',
            name: 'load-pattern-name',
          },
          storageSize: 'storage-size',
        },
      ],
    },
    status: {},
  };
  const vo = getExperimentVO(dtoIn);
  const dtoOut = getExperimentDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      name: 'pipeline-name',
    },
    endpointSpecs: [
      {
        endpointName: 'endpoint-name',
        dataSpec: {
          option: 'dataSet',
          plainText: '',
          dataSetRef: {
            name: 'data-set-name',
          },
        },
        loadPatternRef: {
          namespace: 'load-pattern-namespace',
          name: 'load-pattern-name',
        },
        storageSize: 'storage-size',
      },
    ],
    hasScheduledTime: false,
    scheduledTime: '',
    drainingMode: 'none',
    drainingTime: '',
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      k6RunnerImage: 'k6-runner-image',
      k6StarterImage: 'k6-starter-image',
      k6InitializerImage: 'k6-initializer-image',
      pipelineRef: {
        name: 'pipeline-name',
      },
      endpointSpecs: [
        {
          endpointName: 'endpoint-name',
          dataSpec: {
            plainText: undefined,
            dataSetRef: {
              name: 'data-set-name',
            },
          },
          loadPatternRef: {
            namespace: 'load-pattern-namespace',
            name: 'load-pattern-name',
          },
          storageSize: 'storage-size',
        },
      ],
      scheduledTime: undefined,
      drainingTime: undefined,
      useEndDetection: undefined,
    },
  });
});

test('VO->DTO, No Draining', () => {
  const vo: ExperimentVO = {
    originalObject: {},
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      name: '',
    },
    endpointSpecs: [],
    hasScheduledTime: false,
    scheduledTime: '',
    drainingMode: 'none',
    drainingTime: 'draining-time',
  };
  const dto = getExperimentDTO(vo);

  expect(dto).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineRef: {
        name: '',
      },
      endpointSpecs: [],
      scheduledTime: undefined,
      drainingTime: undefined,
      useEndDetection: undefined,
    },
  });
});

test('VO->DTO, Time-based Draining', () => {
  const vo: ExperimentVO = {
    originalObject: {},
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      name: '',
    },
    endpointSpecs: [],
    hasScheduledTime: false,
    scheduledTime: '',
    drainingMode: 'time',
    drainingTime: 'draining-time',
  };
  const dto = getExperimentDTO(vo);

  expect(dto).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineRef: {
        name: '',
      },
      endpointSpecs: [],
      scheduledTime: undefined,
      drainingTime: 'draining-time',
      useEndDetection: undefined,
    },
  });
});

test('VO->DTO, End Detection', () => {
  const vo: ExperimentVO = {
    originalObject: {},
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      name: '',
    },
    endpointSpecs: [],
    hasScheduledTime: false,
    scheduledTime: '',
    drainingMode: 'endDetection',
    drainingTime: 'draining-time',
  };
  const dto = getExperimentDTO(vo);

  expect(dto).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineRef: {
        name: '',
      },
      endpointSpecs: [],
      scheduledTime: undefined,
      drainingTime: undefined,
      useEndDetection: true,
    },
  });
});
