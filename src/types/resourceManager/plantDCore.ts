/** Type definition for the metadata of a PlantDCore */
export type PlantDCoreMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a PlantDCore */
export type PlantDCoreSpec = {
  // TODO: implement it
};

/** Type definition for the status of a PlantDCore */
export type PlantDCoreStatus = {
  kubeProxyStatus?: string;
  studioStatus?: string;
  prometheusStatus?: string;
};

/** Type definition for the data transfer object of a PlantDCore */
export type PlantDCoreDTO = {
  metadata: PlantDCoreMetadata;
  spec: PlantDCoreSpec;
  status: PlantDCoreStatus | undefined;
};

/** Type definition for the view object of a PlantDCore */
export type PlantDCoreVO = {
  // TODO: implement it
};
