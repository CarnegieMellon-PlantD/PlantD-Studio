/** Type definition for the metadata of a Pipeline */
export type PipelineMetadata = {
  namespace: string;
  name: string;
};

export type HTTPOptions = {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
};

/** Type definition for the spec of a Pipeline */
export type PipelineSpec = {
  inCluster?: boolean;
  pipelineEndpoints?: Array<{
    name?: string;
    http?: HTTPOptions;
  }>;
  metricsEndpoint?: {
    http?: HTTPOptions;
    serviceRef?: {
      name: string;
    };
    port?: string;
    path?: string;
  };
  healthCheckURLs?: string[];
  enableCostCalculation?: boolean;
  cloudProvider?: string;
  tags?: Record<string, string>;
};

/** Type definition for the status of a Pipeline */
export type PipelineStatus = {
  availability?: string;
};

/** Type definition for the data transfer object of a Pipeline */
export type PipelineDTO = {
  metadata: PipelineMetadata;
  spec: PipelineSpec;
  status: PipelineStatus | undefined;
};

/** Type definition for the view object of a Pipeline */
export type PipelineVO = {
  originalObject: PipelineSpec;
  namespace: string;
  name: string;
  inCluster: boolean;
  pipelineEndpoints: Array<{
    name: string;
    protocol: 'http';
    http: {
      url: string;
      method: string;
      headers: Array<{
        key: string;
        value: string;
      }>;
    };
  }>;
  metricsEndpoint: {
    http: {
      url: string;
    };
    serviceRef: {
      name: string;
    };
    port: string;
    path: string;
  };
  healthCheckURLs: string[];
  enableCostCalculation: boolean;
  cloudProvider: string;
  tags: Array<{
    key: string;
    value: string;
  }>;
};

/** Enums of `status.pipelineAvailability` */
export enum PipelineAvailability {
  Ready = 'Ready',
  InUse = 'In-Use',
}

/** All `status.pipelineAvailability` for enumerating and sorting */
export const allPipelineAvailabilities: PipelineAvailability[] = [
  PipelineAvailability.Ready,
  PipelineAvailability.InUse,
];
