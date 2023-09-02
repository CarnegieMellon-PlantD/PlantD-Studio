import { expect, test } from '@jest/globals';

import { getEndpointDTO, getEndpointVO, getPipelineDTO, getPipelineVO } from './convertPipeline';

test('DTO->VO (Endpoint, fallback values)', () => {
  expect(getEndpointVO({})).toStrictEqual({
    name: '',
    type: '',
    http: {
      url: '',
      method: '',
      headers: [],
      body: {
        type: '',
        data: '',
        dataSetRef: {
          namespace: '',
          name: '',
        },
      },
    },
    websocket: {
      url: '',
      params: [],
      callback: '',
    },
    grpc: {
      address: '',
      protoFiles: [],
      url: '',
      params: [],
      request: [],
    },
    serviceRef: {
      namespace: '',
      name: '',
    },
    port: '',
  });
});

test('DTO->VO (Endpoint, HTTP, data)', () => {
  expect(
    getEndpointVO({
      name: 'name',
      http: {
        url: 'url',
        method: 'method',
        headers: { key: 'value' },
        body: {
          data: 'data',
        },
      },
      serviceRef: {
        namespace: 'namespace',
        name: 'name',
      },
      port: 'port',
    })
  ).toStrictEqual({
    name: 'name',
    type: 'http',
    http: {
      url: 'url',
      method: 'method',
      headers: [{ key: 'key', value: 'value' }],
      body: {
        type: 'data',
        data: 'data',
        dataSetRef: {
          namespace: '',
          name: '',
        },
      },
    },
    websocket: {
      url: '',
      params: [],
      callback: '',
    },
    grpc: {
      address: '',
      protoFiles: [],
      url: '',
      params: [],
      request: [],
    },
    serviceRef: {
      namespace: 'namespace',
      name: 'name',
    },
    port: 'port',
  });
});

test('DTO->VO (Endpoint, HTTP, dataSetRef)', () => {
  expect(
    getEndpointVO({
      name: 'name',
      http: {
        url: 'url',
        method: 'method',
        headers: { key: 'value' },
        body: {
          dataSetRef: {
            namespace: 'namespace',
            name: 'name',
          },
        },
      },
      serviceRef: {
        namespace: 'namespace',
        name: 'name',
      },
      port: 'port',
    })
  ).toStrictEqual({
    name: 'name',
    type: 'http',
    http: {
      url: 'url',
      method: 'method',
      headers: [{ key: 'key', value: 'value' }],
      body: {
        type: 'dataSetRef',
        data: '',
        dataSetRef: {
          namespace: 'namespace',
          name: 'name',
        },
      },
    },
    websocket: {
      url: '',
      params: [],
      callback: '',
    },
    grpc: {
      address: '',
      protoFiles: [],
      url: '',
      params: [],
      request: [],
    },
    serviceRef: {
      namespace: 'namespace',
      name: 'name',
    },
    port: 'port',
  });
});

test('DTO->VO (Endpoint, WebSocket)', () => {
  expect(
    getEndpointVO({
      name: 'name',
      websocket: {
        url: 'url',
        params: { key: 'value' },
        callback: 'callback',
      },
      serviceRef: {
        namespace: 'namespace',
        name: 'name',
      },
      port: 'port',
    })
  ).toStrictEqual({
    name: 'name',
    type: 'websocket',
    http: {
      url: '',
      method: '',
      headers: [],
      body: {
        type: '',
        data: '',
        dataSetRef: {
          namespace: '',
          name: '',
        },
      },
    },
    websocket: {
      url: 'url',
      params: [{ key: 'key', value: 'value' }],
      callback: 'callback',
    },
    grpc: {
      address: '',
      protoFiles: [],
      url: '',
      params: [],
      request: [],
    },
    serviceRef: {
      namespace: 'namespace',
      name: 'name',
    },
    port: 'port',
  });
});

test('DTO->VO (Endpoint, gRPC)', () => {
  expect(
    getEndpointVO({
      name: 'name',
      grpc: {
        address: 'address',
        protoFiles: ['protoFile'],
        url: 'url',
        params: { key: 'value' },
        request: { key: 'value' },
      },
      serviceRef: {
        namespace: 'namespace',
        name: 'name',
      },
      port: 'port',
    })
  ).toStrictEqual({
    name: 'name',
    type: 'grpc',
    http: {
      url: '',
      method: '',
      headers: [],
      body: {
        type: '',
        data: '',
        dataSetRef: {
          namespace: '',
          name: '',
        },
      },
    },
    websocket: {
      url: '',
      params: [],
      callback: '',
    },
    grpc: {
      address: 'address',
      protoFiles: ['protoFile'],
      url: 'url',
      params: [{ key: 'key', value: 'value' }],
      request: [{ key: 'key', value: 'value' }],
    },
    serviceRef: {
      namespace: 'namespace',
      name: 'name',
    },
    port: 'port',
  });
});

test('VO->DTO (Endpoint, out-of-cluster, metrics endpoint)', () => {
  expect(
    getEndpointDTO(
      {
        name: 'name',
        type: 'http',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: 'data',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      true,
      false
    )
  ).toStrictEqual({
    name: undefined,
    http: {
      url: 'url',
      method: 'method',
      headers: { key: 'value' },
      body: undefined,
    },
    websocket: undefined,
    grpc: undefined,
    serviceRef: undefined,
    port: undefined,
  });
});

test('VO->DTO (Endpoint, in-cluster, metrics endpoint)', () => {
  expect(
    getEndpointDTO(
      {
        name: 'name',
        type: 'http',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: 'data',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      true,
      true
    )
  ).toStrictEqual({
    name: undefined,
    http: undefined,
    websocket: undefined,
    grpc: undefined,
    serviceRef: {
      namespace: 'namespace',
      name: 'name',
    },
    port: 'port',
  });
});

test('VO->DTO (Endpoint, HTTP, data)', () => {
  expect(
    getEndpointDTO(
      {
        name: 'name',
        type: 'http',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: 'data',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      false,
      false
    )
  ).toStrictEqual({
    name: 'name',
    http: {
      url: 'url',
      method: 'method',
      headers: { key: 'value' },
      body: {
        data: 'data',
        dataSetRef: undefined,
      },
    },
    websocket: undefined,
    grpc: undefined,
    serviceRef: undefined,
    port: undefined,
  });
});

test('VO->DTO (Endpoint, HTTP, dataSetRef)', () => {
  expect(
    getEndpointDTO(
      {
        name: 'name',
        type: 'http',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: 'dataSetRef',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      false,
      false
    )
  ).toStrictEqual({
    name: 'name',
    http: {
      url: 'url',
      method: 'method',
      headers: { key: 'value' },
      body: {
        data: undefined,
        dataSetRef: {
          namespace: 'namespace',
          name: 'name',
        },
      },
    },
    websocket: undefined,
    grpc: undefined,
    serviceRef: undefined,
    port: undefined,
  });
});

test('VO->DTO (Endpoint, WebSocket)', () => {
  expect(
    getEndpointDTO(
      {
        name: 'name',
        type: 'websocket',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: '',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      false,
      false
    )
  ).toStrictEqual({
    name: 'name',
    http: undefined,
    websocket: {
      url: 'url',
      params: { key: 'value' },
      callback: 'callback',
    },
    grpc: undefined,
    serviceRef: undefined,
    port: undefined,
  });
});

test('VO->DTO (Endpoint, gRPC)', () => {
  expect(
    getEndpointDTO(
      {
        name: 'name',
        type: 'grpc',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: '',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      false,
      false
    )
  ).toStrictEqual({
    name: 'name',
    http: undefined,
    websocket: undefined,
    grpc: {
      address: 'address',
      protoFiles: ['protoFile'],
      url: 'url',
      params: { key: 'value' },
      request: { key: 'value' },
    },
    serviceRef: undefined,
    port: undefined,
  });
});

test('DTO->VO (Pipeline, fallback values)', () => {
  expect(
    getPipelineVO({
      metadata: {
        namespace: '',
        name: '',
      },
      spec: {},
      status: {},
    })
  ).toStrictEqual({
    namespace: '',
    name: '',
    pipelineEndpoints: [],
    healthCheckEndpoints: [],
    metricsEndpoint: expect.anything(),
    extraMetrics: {
      system: {
        tags: [],
      },
    },
    inCluster: false,
    cloudVendor: '',
    enableCostCalculation: false,
  });
});

test('DTO->VO (Pipeline)', () => {
  expect(
    getPipelineVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        pipelineEndpoints: [{}],
        healthCheckEndpoints: ['healthCheckEndpoint'],
        metricsEndpoint: {},
        extraMetrics: {
          system: {
            tags: { key: 'value' },
          },
        },
        inCluster: true,
        cloudVendor: 'cloudVendor',
        enableCostCalculation: true,
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    pipelineEndpoints: [expect.anything()],
    healthCheckEndpoints: ['healthCheckEndpoint'],
    metricsEndpoint: expect.anything(),
    extraMetrics: {
      system: {
        tags: [{ key: 'key', value: 'value' }],
      },
    },
    inCluster: true,
    cloudVendor: 'cloudVendor',
    enableCostCalculation: true,
  });
});

test('VO->DTO (Pipeline, out-of-cluster)', () => {
  expect(
    getPipelineDTO({
      namespace: 'namespace',
      name: 'name',
      pipelineEndpoints: [
        {
          name: 'name',
          type: 'http',
          http: {
            url: 'url',
            method: 'method',
            headers: [{ key: 'key', value: 'value' }],
            body: {
              type: 'dataSetRef',
              data: 'data',
              dataSetRef: {
                namespace: 'namespace',
                name: 'name',
              },
            },
          },
          websocket: {
            url: 'url',
            params: [{ key: 'key', value: 'value' }],
            callback: 'callback',
          },
          grpc: {
            address: 'address',
            protoFiles: ['protoFile'],
            url: 'url',
            params: [{ key: 'key', value: 'value' }],
            request: [{ key: 'key', value: 'value' }],
          },
          serviceRef: {
            namespace: 'namespace',
            name: 'name',
          },
          port: 'port',
        },
      ],
      healthCheckEndpoints: ['healthCheckEndpoint'],
      metricsEndpoint: {
        name: 'name',
        type: 'http',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: 'dataSetRef',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      extraMetrics: {
        system: {
          tags: [{ key: 'key', value: 'value' }],
        },
      },
      inCluster: false,
      cloudVendor: 'cloudVendor',
      enableCostCalculation: true,
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineEndpoints: [
        {
          name: 'name',
          http: {
            url: 'url',
            method: 'method',
            headers: { key: 'value' },
            body: {
              data: undefined,
              dataSetRef: {
                namespace: 'namespace',
                name: 'name',
              },
            },
          },
          websocket: undefined,
          grpc: undefined,
          serviceRef: undefined,
          port: undefined,
        },
      ],
      healthCheckEndpoints: ['healthCheckEndpoint'],
      metricsEndpoint: {
        name: undefined,
        http: {
          url: 'url',
          method: 'method',
          headers: { key: 'value' },
          body: undefined,
        },
        websocket: undefined,
        grpc: undefined,
        serviceRef: undefined,
        port: undefined,
      },
      extraMetrics: {
        system: {
          tags: { key: 'value' },
        },
      },
      inCluster: false,
      cloudVendor: 'cloudVendor',
      enableCostCalculation: true,
    },
  });
});

test('VO->DTO (Pipeline, in-cluster)', () => {
  expect(
    getPipelineDTO({
      namespace: 'namespace',
      name: 'name',
      pipelineEndpoints: [
        {
          name: 'name',
          type: 'http',
          http: {
            url: 'url',
            method: 'method',
            headers: [{ key: 'key', value: 'value' }],
            body: {
              type: 'dataSetRef',
              data: 'data',
              dataSetRef: {
                namespace: 'namespace',
                name: 'name',
              },
            },
          },
          websocket: {
            url: 'url',
            params: [{ key: 'key', value: 'value' }],
            callback: 'callback',
          },
          grpc: {
            address: 'address',
            protoFiles: ['protoFile'],
            url: 'url',
            params: [{ key: 'key', value: 'value' }],
            request: [{ key: 'key', value: 'value' }],
          },
          serviceRef: {
            namespace: 'namespace',
            name: 'name',
          },
          port: 'port',
        },
      ],
      healthCheckEndpoints: ['healthCheckEndpoint'],
      metricsEndpoint: {
        name: 'name',
        type: 'http',
        http: {
          url: 'url',
          method: 'method',
          headers: [{ key: 'key', value: 'value' }],
          body: {
            type: 'dataSetRef',
            data: 'data',
            dataSetRef: {
              namespace: 'namespace',
              name: 'name',
            },
          },
        },
        websocket: {
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          callback: 'callback',
        },
        grpc: {
          address: 'address',
          protoFiles: ['protoFile'],
          url: 'url',
          params: [{ key: 'key', value: 'value' }],
          request: [{ key: 'key', value: 'value' }],
        },
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      extraMetrics: {
        system: {
          tags: [{ key: 'key', value: 'value' }],
        },
      },
      inCluster: true,
      cloudVendor: 'cloudVendor',
      enableCostCalculation: true,
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineEndpoints: [
        {
          name: 'name',
          http: {
            url: 'url',
            method: 'method',
            headers: { key: 'value' },
            body: {
              data: undefined,
              dataSetRef: {
                namespace: 'namespace',
                name: 'name',
              },
            },
          },
          websocket: undefined,
          grpc: undefined,
          serviceRef: undefined,
          port: undefined,
        },
      ],
      healthCheckEndpoints: ['healthCheckEndpoint'],
      metricsEndpoint: {
        name: undefined,
        http: undefined,
        websocket: undefined,
        grpc: undefined,
        serviceRef: {
          namespace: 'namespace',
          name: 'name',
        },
        port: 'port',
      },
      extraMetrics: {
        system: {
          tags: { key: 'value' },
        },
      },
      inCluster: true,
      cloudVendor: 'cloudVendor',
      enableCostCalculation: true,
    },
  });
});
