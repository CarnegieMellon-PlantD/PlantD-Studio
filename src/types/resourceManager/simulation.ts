/** Type definition for the metadata of a Simulation */
export type SimulationMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Simulation */
export type SimulationSpec = {
  digitalTwinRef?: { name?: string; namespace?: string };
  trafficModelRef?: { name?: string; namespace?: string };
};

/** Type definition for the status of a Simulation */
export type SimulationStatus = Record<string, never>;

/** Type definition for the data transfer object of a Simulation */
export type SimulationDTO = {
  metadata: SimulationMetadata;
  spec: SimulationSpec;
  status: SimulationStatus | undefined;
};

/** Type definition for the view object of a Simulation */
export type SimulationVO = {
  namespace: string;
  name: string;
  digitalTwinRef: {
    name: string;
    namespace: string;
  };
  trafficModelRef: {
    name: string;
    namespace: string;
  };
};

/** Enums of `status.experimentState` */
export enum SimulationJobStatus {
  Pending = 'Pending',
  Initializing = 'Initializing',
  WaitingForPipelineReady = 'WaitingForPipelineReady',
  Ready = 'Ready',
  Running = 'Running',
  Finished = 'Finished',
  Error = 'Error',
}

/** All `status.simulationJobStatus` for enumerating and sorting */
export const allSimulationSimulationJobStatus: SimulationJobStatus[] = [
  SimulationJobStatus.Pending,
  SimulationJobStatus.Initializing,
  SimulationJobStatus.WaitingForPipelineReady,
  SimulationJobStatus.Ready,
  SimulationJobStatus.Running,
  SimulationJobStatus.Finished,
  SimulationJobStatus.Error,
];
