import { expect, test } from '@jest/globals';

import { PipelineDTO } from '@/types/resourceManager/pipeline';
import { getPipelineDTO, getPipelineVO } from './convertPipeline';

test('DTO->VO, Default', () => {
  const dtoIn: PipelineDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getPipelineVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    inCluster: false,
    pipelineEndpoints: [],
    metricsEndpoint: {
      http: {
        url: '',
      },
      serviceRef: {
        name: '',
      },
      port: '',
      path: '',
    },
    healthCheckURLs: [],
    enableCostCalculation: false,
    cloudProvider: '',
    tags: [],
  });
});

test('DTO->VO->DTO, In-Cluster, Cost On', () => {
  const dtoIn: PipelineDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      inCluster: true,
      pipelineEndpoints: [
        {
          name: 'name',
          http: {
            url: 'url',
            method: 'GET',
            headers: {
              key: 'value',
            },
          },
        },
      ],
      metricsEndpoint: {
        http: {
          url: 'url',
        },
        serviceRef: {
          name: 'name',
        },
        port: 'port',
        path: 'path',
      },
      healthCheckURLs: ['url'],
      enableCostCalculation: true,
      cloudProvider: 'cloudProvider',
      tags: {
        key: 'value',
      },
    },
    status: {},
  };
  const vo = getPipelineVO(dtoIn);
  const dtoOut = getPipelineDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    inCluster: true,
    pipelineEndpoints: [
      {
        name: 'name',
        protocol: 'http',
        http: {
          url: 'url',
          method: 'GET',
          headers: [{ key: 'key', value: 'value' }],
        },
      },
    ],
    metricsEndpoint: {
      http: {
        url: 'url',
      },
      serviceRef: {
        name: 'name',
      },
      port: 'port',
      path: 'path',
    },
    healthCheckURLs: ['url'],
    enableCostCalculation: true,
    cloudProvider: 'cloudProvider',
    tags: [{ key: 'key', value: 'value' }],
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      inCluster: true,
      pipelineEndpoints: [
        {
          name: 'name',
          http: {
            url: 'url',
            method: 'GET',
            headers: {
              key: 'value',
            },
          },
        },
      ],
      metricsEndpoint: {
        http: undefined,
        serviceRef: {
          name: 'name',
        },
        port: 'port',
        path: 'path',
      },
      healthCheckURLs: ['url'],
      enableCostCalculation: true,
      cloudProvider: 'cloudProvider',
      tags: {
        key: 'value',
      },
    },
  });
});

test('DTO->VO->DTO, Out-Cluster, Cost Off', () => {
  const dtoIn: PipelineDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      inCluster: false,
      pipelineEndpoints: [
        {
          name: 'name',
          http: {
            url: 'url',
            method: 'GET',
            headers: {
              key: 'value',
            },
          },
        },
      ],
      metricsEndpoint: {
        http: {
          url: 'url',
        },
        serviceRef: {
          name: 'name',
        },
        port: 'port',
        path: 'path',
      },
      healthCheckURLs: ['url'],
      enableCostCalculation: false,
      cloudProvider: 'cloudProvider',
      tags: {
        key: 'value',
      },
    },
    status: {},
  };
  const vo = getPipelineVO(dtoIn);
  const dtoOut = getPipelineDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    inCluster: false,
    pipelineEndpoints: [
      {
        name: 'name',
        protocol: 'http',
        http: {
          url: 'url',
          method: 'GET',
          headers: [{ key: 'key', value: 'value' }],
        },
      },
    ],
    metricsEndpoint: {
      http: {
        url: 'url',
      },
      serviceRef: {
        name: 'name',
      },
      port: 'port',
      path: 'path',
    },
    healthCheckURLs: ['url'],
    enableCostCalculation: false,
    cloudProvider: 'cloudProvider',
    tags: [{ key: 'key', value: 'value' }],
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      inCluster: false,
      pipelineEndpoints: [
        {
          name: 'name',
          http: {
            url: 'url',
            method: 'GET',
            headers: {
              key: 'value',
            },
          },
        },
      ],
      metricsEndpoint: {
        http: {
          url: 'url',
        },
        serviceRef: undefined,
        port: undefined,
        path: undefined,
      },
      healthCheckURLs: ['url'],
      enableCostCalculation: false,
      cloudProvider: undefined,
      tags: undefined,
    },
  });
});
