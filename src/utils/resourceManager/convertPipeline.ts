import { EndpointDTO, EndpointVO, PipelineDTO, PipelineVO } from '@/types/resourceManager/pipeline';

/**
 * Convert the data transfer object of an Endpoint to the view object
 * @param endpointDTO The data transfer object of an Endpoint
 * @returns The view object of an Endpoint
 */
export const getEndpointVO = (endpointDTO: EndpointDTO): EndpointVO => {
  return {
    name: endpointDTO.name ?? '',
    type:
      endpointDTO.http !== undefined
        ? 'http'
        : endpointDTO.websocket !== undefined
        ? 'websocket'
        : endpointDTO.grpc !== undefined
        ? 'grpc'
        : '',
    http: {
      url: endpointDTO.http?.url ?? '',
      method: endpointDTO.http?.method ?? '',
      headers:
        endpointDTO.http?.headers === undefined
          ? []
          : Object.entries(endpointDTO.http.headers).map(([key, value]) => ({ key, value })),
      body: {
        type:
          endpointDTO.http?.body?.data !== undefined
            ? 'data'
            : endpointDTO.http?.body?.dataSetRef !== undefined
            ? 'dataSetRef'
            : '',
        data: endpointDTO.http?.body?.data ?? '',
        dataSetRef: {
          namespace: endpointDTO.http?.body?.dataSetRef?.namespace ?? '',
          name: endpointDTO.http?.body?.dataSetRef?.name ?? '',
        },
      },
    },
    websocket: {
      url: endpointDTO.websocket?.url ?? '',
      params: Object.entries(endpointDTO.websocket?.params ?? []).map(([key, value]) => ({ key, value })),
      callback: endpointDTO.websocket?.callback ?? '',
    },
    grpc: {
      address: endpointDTO.grpc?.address ?? '',
      protoFiles: endpointDTO.grpc?.protoFiles ?? [],
      url: endpointDTO.grpc?.url ?? '',
      params: Object.entries(endpointDTO.grpc?.params ?? []).map(([key, value]) => ({ key, value })),
      request: Object.entries(endpointDTO.grpc?.request ?? []).map(([key, value]) => ({ key, value })),
    },
    serviceRef: {
      namespace: endpointDTO.serviceRef?.namespace ?? '',
      name: endpointDTO.serviceRef?.name ?? '',
    },
    port: endpointDTO.port ?? '',
  };
};

/**
 * Convert the view object of an Endpoint to the data transfer object
 * @param endpointVO The view object of an Endpoint
 * @param isMetricsEndpoint Whether the Endpoint is a metrics endpoint
 * @param inCluster Whether the Pipeline is in the cluster
 * @returns The data transfer object of an Endpoint
 */
export const getEndpointDTO = (endpointVO: EndpointVO, isMetricsEndpoint: boolean, inCluster: boolean): EndpointDTO => {
  return {
    name: isMetricsEndpoint ? undefined : endpointVO.name,
    http:
      (isMetricsEndpoint && inCluster) || endpointVO.type !== 'http'
        ? undefined
        : {
            url: endpointVO.http.url,
            method: endpointVO.http.method,
            headers: Object.fromEntries(endpointVO.http.headers.map(({ key, value }) => [key, value])),
            body: isMetricsEndpoint
              ? undefined
              : {
                  data: endpointVO.http.body.type !== 'data' ? undefined : endpointVO.http.body.data,
                  dataSetRef: endpointVO.http.body.type !== 'dataSetRef' ? undefined : endpointVO.http.body.dataSetRef,
                },
          },
    websocket:
      (isMetricsEndpoint && inCluster) || endpointVO.type !== 'websocket'
        ? undefined
        : {
            url: endpointVO.websocket.url,
            params: Object.fromEntries(endpointVO.websocket.params.map(({ key, value }) => [key, value])),
            callback: endpointVO.websocket.callback,
          },
    grpc:
      (isMetricsEndpoint && inCluster) || endpointVO.type !== 'grpc'
        ? undefined
        : {
            address: endpointVO.grpc.address,
            protoFiles: endpointVO.grpc.protoFiles,
            url: endpointVO.grpc.url,
            params: Object.fromEntries(endpointVO.grpc.params.map(({ key, value }) => [key, value])),
            request: Object.fromEntries(endpointVO.grpc.request.map(({ key, value }) => [key, value])),
          },
    serviceRef: !isMetricsEndpoint || !inCluster ? undefined : endpointVO.serviceRef,
    port: !isMetricsEndpoint || !inCluster ? undefined : endpointVO.port,
  };
};

/**
 * Convert the data transfer object of a Pipeline to the view object
 * @param pipelineDTO The data transfer object of a Pipeline
 * @returns The view object of a Pipeline
 */
export const getPipelineVO = (pipelineDTO: PipelineDTO): PipelineVO => {
  return {
    namespace: pipelineDTO.metadata.namespace,
    name: pipelineDTO.metadata.name,
    pipelineEndpoints:
      pipelineDTO.spec.pipelineEndpoints === undefined
        ? []
        : pipelineDTO.spec.pipelineEndpoints.map((endpoint) => getEndpointVO(endpoint)),
    healthCheckEndpoints: pipelineDTO.spec.healthCheckEndpoints ?? [],
    metricsEndpoint: getEndpointVO(pipelineDTO.spec.metricsEndpoint ?? {}),
    extraMetrics: {
      system: {
        tags: Object.entries(pipelineDTO.spec.extraMetrics?.system?.tags ?? []).map(([key, value]) => ({ key, value })),
      },
    },
    inCluster: pipelineDTO.spec.inCluster ?? false,
    cloudVendor: pipelineDTO.spec.cloudVendor ?? '',
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
      pipelineEndpoints: pipelineVO.pipelineEndpoints.map((endpoint) =>
        getEndpointDTO(endpoint, false, pipelineVO.inCluster)
      ),
      healthCheckEndpoints: pipelineVO.healthCheckEndpoints,
      metricsEndpoint: getEndpointDTO(pipelineVO.metricsEndpoint, true, pipelineVO.inCluster),
      extraMetrics: {
        system: {
          tags: Object.fromEntries(pipelineVO.extraMetrics.system.tags.map(({ key, value }) => [key, value])),
        },
      },
      inCluster: pipelineVO.inCluster,
      cloudVendor: pipelineVO.cloudVendor,
      enableCostCalculation: pipelineVO.enableCostCalculation,
    },
  };
};
