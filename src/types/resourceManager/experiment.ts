/** Type definition for the metadata of an Experiment */
export type ExperimentMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of an Experiment */
export type ExperimentSpec = {
  k6RunnerImage?: string;
  k6StarterImage?: string;
  k6InitializerImage?: string;
  endDetectionImage?: string;
  pipelineRef?: {
    name?: string;
  };
  endpointSpecs?: Array<{
    endpointName?: string;
    dataSpec?: {
      plainText?: string;
      dataSetRef?: {
        name?: string;
      };
    };
    loadPatternRef?: {
      namespace?: string;
      name?: string;
    };
    storageSize?: string;
  }>;
  scheduledTime?: string;
  drainingTime?: string;
  useEndDetection?: boolean;
};

/** Type definition for the status of an Experiment */
export type ExperimentStatus = {
  durations?: Record<string, string>;
  jobStatus?: string;
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
  originalObject: ExperimentSpec;
  namespace: string;
  name: string;
  pipelineRef: {
    name: string;
  };
  endpointSpecs: Array<{
    endpointName: string;
    dataSpec: {
      option: 'plainText' | 'dataSet';
      plainText: string;
      dataSetRef: {
        name: string;
      };
    };
    loadPatternRef: {
      namespace: string;
      name: string;
    };
    storageSize: string;
  }>;
  hasScheduledTime: boolean;
  scheduledTime: string;
  drainingMode: 'none' | 'time' | 'endDetection';
  drainingTime: string;
};

/** Enums of `status.jobStatus` */
export enum ExperimentJobStatus {
  Scheduled = 'Scheduled',
  WaitingDataSet = 'Waiting for DataSet',
  WaitingPipeline = 'Waiting for Pipeline',
  Initializing = 'Initializing',
  Running = 'Running',
  Draining = 'Draining',
  Completed = 'Completed',
  Failed = 'Failed',
}

/** All `status.jobStatus` for enumerating and sorting */
export const allExperimentJobStatuses: ExperimentJobStatus[] = [
  ExperimentJobStatus.Scheduled,
  ExperimentJobStatus.WaitingDataSet,
  ExperimentJobStatus.WaitingPipeline,
  ExperimentJobStatus.Initializing,
  ExperimentJobStatus.Running,
  ExperimentJobStatus.Draining,
  ExperimentJobStatus.Completed,
  ExperimentJobStatus.Failed,
];
