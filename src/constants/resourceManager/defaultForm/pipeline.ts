import { EndpointVO, PipelineVO } from '@/types/resourceManager/pipeline';

export const getDefaultEndpoint = (namespace: string): EndpointVO => ({
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
        namespace,
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
    namespace,
    name: '',
  },
  port: '',
});

export const getDefaultPipelineForm = (namespace: string): PipelineVO => {
  const metricsEndpoint = getDefaultEndpoint(namespace);
  metricsEndpoint.type = 'http';
  metricsEndpoint.http.method = 'GET';
  return {
    namespace: namespace,
    name: '',
    pipelineEndpoints: [],
    healthCheckEndpoints: [],
    metricsEndpoint,
    extraMetrics: {
      system: {
        tags: [],
      },
    },
    inCluster: false,
    cloudVendor: '',
    enableCostCalculation: false,
  };
};
