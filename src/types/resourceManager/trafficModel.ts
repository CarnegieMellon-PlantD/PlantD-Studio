/** Type definition for the metadata of a TrafficModel */
export type TrafficModelMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a TrafficModel */
export type TrafficModelSpec = {
  config?: string;
};

/** Type definition for the status of a TrafficModel */
export type TrafficModelStatus = Record<string, never>;

/** Type definition for the data transfer object of a TrafficModel */
export type TrafficModelDTO = {
  metadata: TrafficModelMetadata;
  spec: TrafficModelSpec;
  status: TrafficModelStatus | undefined;
};

/** Type definition for the view object of a TrafficModel */
export type TrafficModelVO = {
  originalObject: TrafficModelSpec;
  namespace: string;
  name: string;
  config: string;
};
