/** Type definition for the metadata of a DigitalTwin */
export type DigitalTwinMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a DigitalTwin */
export type DigitalTwinSpec = {
  modelType?: string;
  digitalTwinType?: string;
  experiments?: Array<{
    namespace?: string;
    name?: string;
  }>;
  dataSet?: {
    name?: string;
  };
  pipeline?: {
    name?: string;
  };
  pipelineCapacity?: number;
};

/** Type definition for the status of a DigitalTwin */
export type DigitalTwinStatus = {
  jobStatus?: string;
  error?: string;
};

/** Type definition for the data transfer object of a DigitalTwin */
export type DigitalTwinDTO = {
  metadata: DigitalTwinMetadata;
  spec: DigitalTwinSpec;
  status: DigitalTwinStatus | undefined;
};

/** Type definition for the view object of a DigitalTwin */
export type DigitalTwinVO = {
  originalObject: DigitalTwinSpec;
  namespace: string;
  name: string;
  modelType: string;
  digitalTwinType: 'regular' | 'schemaaware';
  experiments: Array<{
    namespace: string;
    name: string;
  }>;
  dataSet: {
    name: string;
  };
  pipeline: {
    name: string;
  };
  pipelineCapacity: number;
};

/** Enums of `status.jobStatus` */
export enum DigitalTwinJobStatus {
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
}

/** All `status.jobStatus` for enumerating and sorting */
export const allDigitalTwinJobStatuses = [
  DigitalTwinJobStatus.Running,
  DigitalTwinJobStatus.Completed,
  DigitalTwinJobStatus.Failed,
];
