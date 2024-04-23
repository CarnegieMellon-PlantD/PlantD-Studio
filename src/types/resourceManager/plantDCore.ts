/** Type definition for the metadata of a PlantDCore */
export type PlantDCoreMetadata = {
  namespace: string;
  name: string;
};

export type DeploymentConfig = {
  replicas?: number;
  image?: string;
  resources?: Record<string, unknown>;
};

export type StatefulSetConfig = {
  replicas?: number;
  image?: string;
  resources?: Record<string, unknown>;
  storageSize?: string;
};

export type PrometheusConfig = {
  replicas?: number;
  image?: string;
  version?: string;
  scrapeInterval?: string;
  resources?: Record<string, unknown>;
};

export type ThanosConfig = {
  image?: string;
  version?: string;
  objectStoreConfig?: {
    name?: string;
    key?: string;
  };
  sidecar?: StatefulSetConfig;
  store?: StatefulSetConfig;
  compactor?: StatefulSetConfig;
  querier?: StatefulSetConfig;
};

export type OpenCostConfig = {
  replicas?: number;
  image?: string;
  resources?: Record<string, unknown>;
  uiImage?: string;
  uiResources?: Record<string, unknown>;
};

export type ComponentStatus = {
  text?: string;
  numReady?: number;
  numDesired?: number;
};

/** Type definition for the spec of a PlantDCore */
export type PlantDCoreSpec = {
  proxy?: DeploymentConfig;
  studio?: DeploymentConfig;
  prometheus?: PrometheusConfig;
  thanos?: ThanosConfig;
  redis?: StatefulSetConfig;
  opencost?: OpenCostConfig;
};

/** Type definition for the status of a PlantDCore */
export type PlantDCoreStatus = {
  proxyStatus?: ComponentStatus;
  studioStatus?: ComponentStatus;
  prometheusStatus?: ComponentStatus;
  thanosStoreStatus?: ComponentStatus;
  thanosCompactorStatus?: ComponentStatus;
  thanosQuerierStatus?: ComponentStatus;
  redisStatus?: ComponentStatus;
  opencostStatus?: ComponentStatus;
};

/** Type definition for the data transfer object of a PlantDCore */
export type PlantDCoreDTO = {
  metadata: PlantDCoreMetadata;
  spec: PlantDCoreSpec;
  status: PlantDCoreStatus | undefined;
};

/** Type definition for the view object of a PlantDCore */
export type PlantDCoreVO = {
  // Keep the original DTO because we don't need to modify every fields
  originalObject: PlantDCoreSpec;
  namespace: string;
  name: string;
  enableThanos: boolean;
  thanosObjectStoreConfig: {
    name: string;
    key: string;
  };
};
