/** Type definition for the metadata of a Simulation */
export type SimulationMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Simulation */
export type SimulationSpec = {
  image?: string;
  digitalTwinRef?: {
    namespace?: string;
    name?: string;
  };
  trafficModelRef?: {
    namespace?: string;
    name?: string;
  };
  netCostRef?: {
    namespace?: string;
    name?: string;
  };
  scenarioRef?: {
    namespace?: string;
    name?: string;
  };
};

/** Type definition for the status of a Simulation */
export type SimulationStatus = {
  jobStatus?: string;
  error?: string;
};

/** Type definition for the data transfer object of a Simulation */
export type SimulationDTO = {
  metadata: SimulationMetadata;
  spec: SimulationSpec;
  status: SimulationStatus | undefined;
};

/** Type definition for the view object of a Simulation */
export type SimulationVO = {
  originalObject: SimulationSpec;
  namespace: string;
  name: string;
  hasDigitalTwin: boolean;
  digitalTwinRef: {
    name: string;
    namespace: string;
  };
  trafficModelRef: {
    name: string;
    namespace: string;
  };
  hasNetCost: boolean;
  netCostRef: {
    name: string;
    namespace: string;
  };
  scenarioRef: {
    name: string;
    namespace: string;
  };
};

/** Enums of `status.jobStatus` */
export enum SimulationJobStatus {
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
}

/** All `status.jobStatus` for enumerating and sorting */
export const allSimulationSimulationJobStatus: SimulationJobStatus[] = [
  SimulationJobStatus.Running,
  SimulationJobStatus.Completed,
  SimulationJobStatus.Failed,
];
