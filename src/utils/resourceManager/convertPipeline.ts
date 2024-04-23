import { PipelineDTO, PipelineVO } from '@/types/resourceManager/pipeline';

/**
 * Convert the data transfer object of a Pipeline to the view object
 * @param dto The data transfer object of a Pipeline
 * @returns The view object of a Pipeline
 */
export const getPipelineVO = (dto: PipelineDTO): PipelineVO => {
  const vo: PipelineVO = {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    inCluster: dto.spec.inCluster ?? false,
    pipelineEndpoints: [],
    metricsEndpoint: {
      http: {
        url: dto.spec.metricsEndpoint?.http?.url ?? '',
      },
      serviceRef: {
        name: dto.spec.metricsEndpoint?.serviceRef?.name ?? '',
      },
      port: dto.spec.metricsEndpoint?.port ?? '',
      path: dto.spec.metricsEndpoint?.path ?? '',
    },
    healthCheckURLs: dto.spec.healthCheckURLs ?? [],
    enableCostCalculation: dto.spec.enableCostCalculation ?? false,
    cloudProvider: dto.spec.cloudProvider ?? '',
    tags: [],
  };

  if (dto.spec.pipelineEndpoints !== undefined) {
    vo.pipelineEndpoints = dto.spec.pipelineEndpoints.map((endpointIn) => {
      const protocol: PipelineVO['pipelineEndpoints'][number]['protocol'] = 'http';

      const endpointOut: PipelineVO['pipelineEndpoints'][number] = {
        name: endpointIn.name ?? '',
        protocol,
        http: {
          url: endpointIn.http?.url ?? '',
          method: endpointIn.http?.method ?? '',
          headers: [],
        },
      };

      if (endpointIn.http?.headers !== undefined) {
        endpointOut.http.headers = Object.entries(endpointIn.http?.headers).map(([key, value]) => ({ key, value }));
      }

      return endpointOut;
    });
  }

  if (dto.spec.tags !== undefined) {
    vo.tags = Object.entries(dto.spec.tags).map(([key, value]) => ({ key, value }));
  }

  return vo;
};

/**
 * Convert the view object of a Pipeline to the data transfer object
 * @param vo The view object of a Pipeline
 * @returns The data transfer object of a Pipeline
 */
export const getPipelineDTO = (vo: PipelineVO): Pick<PipelineDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      inCluster: vo.inCluster,
      pipelineEndpoints: vo.pipelineEndpoints.map((endpoint) => ({
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
        http: !vo.inCluster
          ? {
              url: vo.metricsEndpoint.http.url,
            }
          : undefined,
        serviceRef: vo.inCluster
          ? {
              name: vo.metricsEndpoint.serviceRef.name,
            }
          : undefined,
        port: vo.inCluster ? vo.metricsEndpoint.port : undefined,
        path: vo.inCluster ? vo.metricsEndpoint.path : undefined,
      },
      healthCheckURLs: vo.healthCheckURLs,
      enableCostCalculation: vo.enableCostCalculation,
      cloudProvider: vo.enableCostCalculation ? vo.cloudProvider : undefined,
      tags: vo.enableCostCalculation ? Object.fromEntries(vo.tags.map(({ key, value }) => [key, value])) : undefined,
    },
  };
};
