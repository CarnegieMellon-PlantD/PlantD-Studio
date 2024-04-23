/** Type definition for the metadata of a Scenario */
export type ScenarioMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Scenario */
export type ScenarioSpec = {
  tasks?: Array<{
    name?: string;
    size?: string;
    sendingDevices?: {
      min?: number;
      max?: number;
    };
    pushFrequencyPerMonth?: {
      min?: number;
      max?: number;
    };
    monthsRelevant?: number[];
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
  originalObject: ScenarioSpec;
  namespace: string;
  name: string;
  tasks: Array<{
    id: string | number;
    name: string;
    size: string;
    sendingDevices: {
      min: number;
      max: number;
    };
    pushFrequencyPerMonth: {
      min: number;
      max: number;
    };
    monthsRelevant: number[];
  }>;
};
