/** Type definition for the metadata of a DigitalTwin */
export type DigitalTwinMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a DigitalTwin */
export type DigitalTwinSpec = {
  experiments?: Array<{
    namespace?: string;
    name?: string;
  }>;
  modelType?: string;
};

/** Type definition for the data transfer object of a DigitalTwin */
export type DigitalTwinDTO = {
  metadata: DigitalTwinMetadata;
  spec: DigitalTwinSpec;
  status: Record<string, never>;
};

/** Type definition for the view object of a DigitalTwin */
export type DigitalTwinVO = {
  namespace: string;
  name: string;
  modelType: string;
  experiments: Array<{
    namespace: string;
    name: string;
  }>;
};
