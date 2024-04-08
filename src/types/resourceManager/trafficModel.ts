/** Type definition for the metadata of a TrafficModel */
export type TrafficModelMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a TrafficModel */
export type TrafficModelSpec = {
  config: string;
};

/** Type definition for the data transfer object of a TrafficModel */
export type TrafficModelDTO = {
  metadata: TrafficModelMetadata;
  spec: TrafficModelSpec;
  status: Record<string, never>;
};

/** Type definition for the view object of a TrafficModel */
export type TrafficModelVO = {
  namespace: string;
  name: string;
  config: string;
};
