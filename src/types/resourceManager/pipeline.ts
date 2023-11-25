/** Type definition for the metadata of a Pipeline */
export type PipelineMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Pipeline */
export type PipelineSpec = {
  pipelineEndpoints?: EndpointDTO[];
  healthCheckEndpoints?: string[];
  metricsEndpoint?: EndpointDTO;
  extraMetrics?: {
    system?: {
      tags?: Record<string, string>;
    };
  };
  inCluster?: boolean;
  cloudVendor?: string;
  enableCostCalculation?: boolean;
};

/** Type definition for the status of a Pipeline */
export type PipelineStatus = {
  pipelineState?: PipelinePipelineState | string;
  statusCheck?: PipelineStatusCheck | string;
};

/** Type definition for the data transfer object of a Pipeline */
export type PipelineDTO = {
  metadata: PipelineMetadata;
  spec: PipelineSpec;
  status: PipelineStatus | undefined;
};

/** Type definition for the view object of a Pipeline */
export type PipelineVO = {
  namespace: string;
  name: string;
  pipelineEndpoints: EndpointVO[];
  healthCheckEndpoints: string[];
  metricsEndpoint: EndpointVO;
  extraMetrics: {
    system: {
      tags: Array<{ key: string; value: string }>;
    };
  };
  inCluster: boolean;
  cloudVendor: string;
  enableCostCalculation: boolean;
};

/** Type definition for the data transfer object of a HTTP protocol */
type HTTPProtocolDTO = {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: {
    data?: string;
    dataSetRef?: {
      namespace?: string;
      name?: string;
    };
  };
};

/** Type definition for the data transfer object of a WebSocket protocol */
type WebSocketProtocolDTO = {
  url?: string;
  params?: Record<string, string>;
  callback?: string;
};

/** Type definition for the data transfer object of a gRPC protocol */
type GRPCProtocolDTO = {
  address?: string;
  protoFiles?: string[];
  url?: string;
  params?: Record<string, string>;
  request?: Record<string, string>;
};

/** Type definition for the data transfer object of an Endpoint */
export type EndpointDTO = {
  name?: string;
  http?: HTTPProtocolDTO;
  websocket?: WebSocketProtocolDTO;
  grpc?: GRPCProtocolDTO;
  serviceRef?: {
    namespace?: string;
    name?: string;
  };
  port?: string;
};

/** Type definition for the view object of an HTTP protocol */
type HTTPProtocolVO = {
  url: string;
  method: string;
  headers: Array<{
    key: string;
    value: string;
  }>;
  body: {
    type: 'data' | 'dataSetRef' | '';
    data: string;
    dataSetRef: {
      namespace: string;
      name: string;
    };
  };
};

/** Type definition for the view object of a WebSocket protocol */
type WebSocketProtocolVO = {
  url: string;
  params: Array<{
    key: string;
    value: string;
  }>;
  callback: string;
};

/** Type definition for the view object of a gRPC protocol */
type GRPCProtocolVO = {
  address: string;
  protoFiles: string[];
  url: string;
  params: Array<{
    key: string;
    value: string;
  }>;
  request: Array<{
    key: string;
    value: string;
  }>;
};

/** Type definition for the view object of an Endpoint */
export type EndpointVO = {
  name: string;
  type: 'http' | 'websocket' | 'grpc' | '';
  http: HTTPProtocolVO;
  websocket: WebSocketProtocolVO;
  grpc: GRPCProtocolVO;
  serviceRef: {
    namespace: string;
    name: string;
  };
  port: string;
};

/** Enums of `status.pipelineState` */
export enum PipelinePipelineState {
  Initializing = 'Initializing',
  Available = 'Available',
  Engaged = 'Engaged',
}

/** All `status.pipelineState` for enumerating and sorting */
export const allPipelinePipelineStates: PipelinePipelineState[] = [
  PipelinePipelineState.Initializing,
  PipelinePipelineState.Available,
  PipelinePipelineState.Engaged,
];

/** Enums of `status.statusCheck` */
export enum PipelineStatusCheck {
  OK = 'OK',
  Failed = 'Failed',
}

/** All `status.statusCheck` for enumerating and sorting */
export const allPipelineStatusChecks: PipelineStatusCheck[] = [PipelineStatusCheck.OK, PipelineStatusCheck.Failed];
