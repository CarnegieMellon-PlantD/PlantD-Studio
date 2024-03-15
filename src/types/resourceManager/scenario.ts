/** Type definition for the metadata of a Scenario */
export type ScenarioMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the dataSetConfig of a Scenario */
export type DataSetConfig = {
  compressPerSchema: boolean;
  compressedFileFormat: string;
  fileFormat: string;
};

/** Type definition for the pipelineRef of a Scenario */
export type PipelineRef = {
  name: string;
  namespace: string;
};

/** Type definition for the pushFrequencyPerMonth of a Scenario */
export type PushFrequencyPerMonth = {
  max: number;
  min: number;
};

/** Type definition for the sendingDevices of a Scenario */
export type SendingDevices = {
  max: number;
  min: number;
};

/** Type definition for the tasks of a Scenario */
export type Task = {
  monthsRelevant: number[];
  name: string;
  pushFrequencyPerMonth: PushFrequencyPerMonth;
  sendingDevices: SendingDevices;
  size: string;
};

/** Type definition for the spec of a Scenario */
export type ScenarioSpec = {
  dataSetConfig: DataSetConfig;
  pipelineRef: PipelineRef;
  tasks: Task[];
};

/** Type definition for the data transfer object of a Scenario */
export type ScenarioDTO = {
  metadata: ScenarioMetadata;
  spec: ScenarioSpec;
  status: Record<string, never>;
};

/** Type definition for the view object of a Scenario */
export type ScenarioVO = {
  namespace: string;
  name: string;
  dataSetConfig: DataSetConfig;
  pipelineRef: PipelineRef;
  tasks: Task[];
};
