/** Type definition for the metadata of an Experiment */
export type ExperimentMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of an Experiment */
export type ExperimentSpec = {
  pipelineRef?: {
    namespace?: string;
    name?: string;
  };
  loadPatterns?: Array<{
    endpointName?: string;
    loadPatternRef?: {
      namespace?: string;
      name?: string;
    };
  }>;
  scheduledTime?: string;
};

/** Type definition for the status of an Experiment */
export type ExperimentStatus = {
  experimentState?: ExperimentExperimentState | string;
  duration?: Record<string, string>;
  startTime?: string;
};

/** Type definition for the data transfer object of an Experiment */
export type ExperimentDTO = {
  metadata: ExperimentMetadata;
  spec: ExperimentSpec;
  status: ExperimentStatus;
};

/** Type definition for the view object of an Experiment */
export type ExperimentVO = {
  namespace: string;
  name: string;
  pipelineRef: {
    namespace: string;
    name: string;
  };
  loadPatterns: Array<{
    endpointName: string;
    loadPatternRef: {
      namespace: string;
      name: string;
    };
  }>;

  hasScheduledTime: boolean;
  scheduledTime: string;
};

/** Enums of `status.experimentState` */
export enum ExperimentExperimentState {
  Pending = 'Pending',
  Initializing = 'Initializing',
  WaitingForPipelineReady = 'WaitingForPipelineReady',
  Ready = 'Ready',
  Running = 'Running',
  Finished = 'Finished',
  Error = 'Error',
}

/** All `status.experimentState` for enumerating and sorting */
export const allExperimentExperimentStates: ExperimentExperimentState[] = [
  ExperimentExperimentState.Pending,
  ExperimentExperimentState.Initializing,
  ExperimentExperimentState.WaitingForPipelineReady,
  ExperimentExperimentState.Ready,
  ExperimentExperimentState.Running,
  ExperimentExperimentState.Finished,
  ExperimentExperimentState.Error,
];
