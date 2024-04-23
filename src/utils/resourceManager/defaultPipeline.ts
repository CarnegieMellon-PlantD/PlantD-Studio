import { PipelineVO } from '@/types/resourceManager/pipeline';

export const getDefaultPipeline = (namespace: string): PipelineVO => {
  return {
    originalObject: {},
    namespace: namespace,
    name: '',
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
  };
};

export const getDefaultPipelineEndpoint = (): PipelineVO['pipelineEndpoints'][number] => ({
  name: '',
  protocol: 'http',
  http: {
    url: '',
    method: 'GET',
    headers: [],
  },
});
