import { PipelineDTO, PipelineVO } from '@/types/resourceManager/pipeline';

/**
 * Convert the data transfer object of a Pipeline to the view object
 * @param pipelineDTO The data transfer object of a Pipeline
 * @returns The view object of a Pipeline
 */
export const getPipelineVO = (pipelineDTO: PipelineDTO): PipelineVO => {
  return {
    namespace: pipelineDTO.metadata.namespace,
    name: pipelineDTO.metadata.name,
    inCluster: pipelineDTO.spec.inCluster ?? false,
    pipelineEndpoints: pipelineDTO.spec.pipelineEndpoints.map((endpoint) => ({
      name: endpoint.name,
      protocol: 'http',
      http: {
        url: endpoint.http?.url ?? '',
        method: endpoint.http?.method ?? '',
        headers: Object.entries(endpoint.http?.headers ?? []).map(([key, value]) => ({ key, value })),
      },
    })),
    metricsEndpoint: {
      http: {
        url: pipelineDTO.spec.metricsEndpoint.http?.url ?? '',
      },
      serviceRef: {
        name: pipelineDTO.spec.metricsEndpoint.serviceRef?.name ?? '',
      },
      port: pipelineDTO.spec.metricsEndpoint.port ?? '',
      path: pipelineDTO.spec.metricsEndpoint.path ?? '',
    },
    healthCheckURLs: pipelineDTO.spec.healthCheckURLs ?? [],
    cloudProvider: pipelineDTO.spec.cloudProvider ?? '',
    tags: Object.entries(pipelineDTO.spec.tags ?? []).map(([key, value]) => ({ key, value })),
    enableCostCalculation: pipelineDTO.spec.enableCostCalculation ?? false,
  };
};

/**
 * Convert the view object of a Pipeline to the data transfer object
 * @param pipelineVO The view object of a Pipeline
 * @returns The data transfer object of a Pipeline
 */
export const getPipelineDTO = (pipelineVO: PipelineVO): Pick<PipelineDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: pipelineVO.namespace,
      name: pipelineVO.name,
    },
    spec: {
      inCluster: pipelineVO.inCluster,
      pipelineEndpoints: pipelineVO.pipelineEndpoints.map((endpoint) => ({
        name: endpoint.name,
        http:
          endpoint.protocol === 'http'
            ? {
                url: endpoint.http.url,
                method: endpoint.http.method,
                headers: Object.fromEntries(endpoint.http.headers.map(({ key, value }) => [key, value])),
              }
            : undefined,
      })),
      metricsEndpoint: {
        http: !pipelineVO.inCluster
          ? {
              url: pipelineVO.metricsEndpoint.http.url,
            }
          : undefined,
        serviceRef: pipelineVO.inCluster
          ? {
              name: pipelineVO.metricsEndpoint.serviceRef.name,
            }
          : undefined,
        port: pipelineVO.metricsEndpoint.port,
        path: pipelineVO.metricsEndpoint.path,
      },
      healthCheckURLs: pipelineVO.healthCheckURLs,
      cloudProvider: pipelineVO.cloudProvider,
      tags: Object.fromEntries(pipelineVO.tags.map(({ key, value }) => [key, value])),
      enableCostCalculation: pipelineVO.enableCostCalculation,
    },
  };
};
