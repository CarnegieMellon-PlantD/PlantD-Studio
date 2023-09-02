/** Type definition for the metadata of a LoadPattern */
export type LoadPatternMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a LoadPattern */
export type LoadPatternSpec = {
  stages?: Array<{
    target?: number;
    duration?: string;
  }>;
  preAllocatedVUs?: number;
  startRate?: number;
  maxVUs?: number;
  timeUnit?: string;
};

/** Type definition for the status of a LoadPattern */
export type LoadPatternStatus = Record<string, never>;

/** Type definition for the data transfer object of a LoadPattern */
export type LoadPatternDTO = {
  metadata: LoadPatternMetadata;
  spec: LoadPatternSpec;
  status: LoadPatternStatus;
};

/** Type definition for the view object of a LoadPattern */
export type LoadPatternVO = {
  /** Namespace */
  namespace: string;
  /** Name */
  name: string;
  /** Stages */
  stages: Array<{
    /** ID of the stage */
    id: string | number;
    /** Target of the stage */
    target: number;
    /** Duration of the stage */
    duration: number;
    /** Duration unit of the stage */
    durationUnit: string;
  }>;
};
