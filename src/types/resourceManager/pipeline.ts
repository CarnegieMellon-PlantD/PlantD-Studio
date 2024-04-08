/** Type definition for the metadata of a Pipeline */
export type PipelineMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Pipeline */
export type PipelineSpec = {
  inCluster?: boolean;
  pipelineEndpoints: Array<{
    name: string;
    http?: HTTPOptions;
  }>;
  metricsEndpoint: {
    http?: HTTPOptions;
    serviceRef?: {
      name: string;
    };
    port?: string;
    path?: string;
  };
  healthCheckURLs?: string[];
  cloudProvider?: string;
  tags?: Record<string, string>;
  enableCostCalculation?: boolean;
};

/** Type definition for the status of a Pipeline */
export type PipelineStatus = {
  availability?: PipelineAvailability;
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
  inCluster: boolean;
  pipelineEndpoints: Array<{
    name: string;
    protocol: string;
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
  cloudProvider: string;
  tags: Array<{
    key: string;
    value: string;
  }>;
  enableCostCalculation: boolean;
};

/** Type definition for the HTTP protocol options */
export type HTTPOptions = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
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
