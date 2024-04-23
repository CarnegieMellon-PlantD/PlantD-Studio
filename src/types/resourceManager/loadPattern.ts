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
  timeUnit?: string;
  maxVUs?: number;
};

/** Type definition for the status of a LoadPattern */
export type LoadPatternStatus = Record<string, never>;

/** Type definition for the data transfer object of a LoadPattern */
export type LoadPatternDTO = {
  metadata: LoadPatternMetadata;
  spec: LoadPatternSpec;
  status: LoadPatternStatus | undefined;
};

/** Type definition for the view object of a LoadPattern */
export type LoadPatternVO = {
  originalObject: LoadPatternSpec;
  namespace: string;
  name: string;
  stages: Array<{
    id: string | number;
    target: number;
    duration: string;
  }>;
};
