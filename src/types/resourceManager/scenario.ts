/** Type definition for the metadata of a Scenario */
export type ScenarioMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Scenario */
export type ScenarioSpec = {
  dataSetConfig: {
    compressPerSchema: boolean;
    compressedFileFormat: string;
    fileFormat: string;
  };
  pipelineRef: {
    namespace: string;
    name: string;
  };
  tasks: Array<{
    monthsRelevant: number[];
    name: string;
    pushFrequencyPerMonth: {
      max: number;
      min: number;
    };
    sendingDevices: {
      max: number;
      min: number;
    };
    size: string;
  }>;
};

/** Type definition for the status of a Scenario */
export type ScenarioStatus = Record<string, never>;

/** Type definition for the data transfer object of a Scenario */
export type ScenarioDTO = {
  metadata: ScenarioMetadata;
  spec: ScenarioSpec;
  status: ScenarioStatus;
};

/** Type definition for the view object of a Scenario */
export type ScenarioVO = {
  namespace: string;
  name: string;
  dataSetConfig: {
    compressPerSchema: boolean;
    compressedFileFormat: string;
    fileFormat: string;
  };
  pipelineRef: {
    namespace: string;
    name: string;
  };
  tasks: Array<{
    id: string | number;
    monthsRelevant: number[];
    name: string;
    pushFrequencyPerMonth: {
      max: number;
      min: number;
    };
    sendingDevices: {
      max: number;
      min: number;
    };
    size: string;
  }>;
};
