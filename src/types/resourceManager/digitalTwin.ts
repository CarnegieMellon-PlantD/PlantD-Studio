/** Type definition for the metadata of a DigitalTwin */
export type DigitalTwinMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a DigitalTwin */
export type DigitalTwinSpec = {
  experiments?: Array<{
    endpointName?: string;
    experimentRef?: {
      namespace?: string;
      name?: string;
    };
  }>;
  modelType?: string;
};

/** Type definition for the status of a DigitalTwin */
export type DigitalTwinStatus = {
  // Replace with the status of a DigitalTwin
};

/** Type definition for the data transfer object of a DigitalTwin */
export type DigitalTwinDTO = {
  // experiments: { endpointName: string; experimentRef: { namespace: string; name: string; }; }[];
  metadata: DigitalTwinMetadata;
  spec: DigitalTwinSpec;
  status: DigitalTwinStatus | undefined;
  // modelType: string;
};

/** Type definition for the view object of a DigitalTwin */
export type DigitalTwinVO = {
  namespace: string;
  name: string;
  modelType: string;
  experiments: Array<{
    endpointName: string;
    experimentRef: {
      namespace: string;
      name: string;
    };
  }>;
};

/** Enums of `status.digitalTwinState` */
export enum DigitalTwinState {}
// Replace with the states of a DigitalTwin

/** All `status.digitalTwinState` for enumerating and sorting */
export const allDigitalTwinStates: DigitalTwinState[] = [
  // Replace with the states of a DigitalTwin
];
