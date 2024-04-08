/** Type definition for the metadata of an Experiment */
export type ExperimentMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of an Experiment */
export type ExperimentSpec = {
  pipelineRef: {
    namespace?: string;
    name?: string;
  };
  endpointSpecs: Array<{
    endpointName: string;
    dataSpec: {
      plainText?: string;
      dataSetRef?: {
        namespace?: string;
        name?: string;
      };
    };
    loadPatternRef: {
      namespace?: string;
      name?: string;
    };
  }>;
  scheduledTime?: string;
};

/** Type definition for the status of an Experiment */
export type ExperimentStatus = {
  durations?: Record<string, string>;
  jobStatus?: ExperimentJobStatus | string;
  startTime?: string;
  completionTime?: string;
  error?: string;
};

/** Type definition for the data transfer object of an Experiment */
export type ExperimentDTO = {
  metadata: ExperimentMetadata;
  spec: ExperimentSpec;
  status: ExperimentStatus | undefined;
};

/** Type definition for the view object of an Experiment */
export type ExperimentVO = {
  namespace: string;
  name: string;
  pipelineRef: {
    namespace: string;
    name: string;
  };
  endpointSpecs: Array<{
    endpointName: string;
    dataSpec: {
      option: 'plainText' | 'dataSet';
      plainText: string;
      dataSetRef: {
        namespace: string;
        name: string;
      };
    };
    loadPatternRef: {
      namespace: string;
      name: string;
    };
  }>;
  hasScheduledTime: boolean;
  scheduledTime: string;
};

/** Enums of `status.jobStatus` */
export enum ExperimentJobStatus {
  Scheduled = 'Scheduled',
  WaitingDataSet = 'Waiting for DataSet',
  WaitingPipeline = 'Waiting for Pipeline',
  Initializing = 'Initializing',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
}

/** All `status.experimentState` for enumerating and sorting */
export const allExperimentJobStatuses: ExperimentJobStatus[] = [
  ExperimentJobStatus.Scheduled,
  ExperimentJobStatus.WaitingDataSet,
  ExperimentJobStatus.WaitingPipeline,
  ExperimentJobStatus.Initializing,
  ExperimentJobStatus.Running,
  ExperimentJobStatus.Completed,
  ExperimentJobStatus.Failed,
];
