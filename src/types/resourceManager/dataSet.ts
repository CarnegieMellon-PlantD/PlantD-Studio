/** Type definition for the metadata of a DataSet */
export type DataSetMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a DataSet */
export type DataSetSpec = {
  image?: string;
  parallelism?: number;
  fileFormat: string;
  compressedFileFormat?: string;
  compressPerSchema?: boolean;
  numFiles: number;
  schemas: Array<{
    name: string;
    numRecords: {
      min: number;
      max: number;
    };
    numFilesPerCompressedFile?: {
      min: number;
      max: number;
    };
  }>;
};

/** Type definition for the status of a DataSet */
export type DataSetStatus = {
  jobStatus?: DataSetJobStatus | string;
  pvcStatus?: DataSetPvcStatus | string;
  errorCount?: number;
  errors?: Record<DataSetErrorType | string, string[]>;
};

/** Type definition for the data transfer object of a DataSet */
export type DataSetDTO = {
  metadata: DataSetMetadata;
  spec: DataSetSpec;
  status: DataSetStatus | undefined;
};

/** Type definition for the view object of a DataSet */
export type DataSetVO = {
  /** Namespace */
  namespace: string;
  /** Name */
  name: string;
  /** File format */
  fileFormat: string;
  /** Whether to use compression */
  useCompression: boolean;
  /** Compressed file format */
  compressedFileFormat: string;
  /** Whether to create a compressed file for each schema rather than for all schemas in each repeat */
  compressPerSchema: boolean;
  /** Number of files */
  numFiles: number;
  /** Schemas */
  schemas: Array<{
    /** ID of the schema */
    id: string | number;
    /** Name of the schema */
    name: string;
    /** Number of records in each file */
    numRecords: {
      min: number;
      max: number;
    };
    /** Number of files in each compressed file */
    numFilesPerCompressedFile: {
      min: number;
      max: number;
    };
  }>;
};

/** Enums of `status.jobStatus` */
export enum DataSetJobStatus {
  Running = 'Running',
  Success = 'Success',
  Failed = 'Failed',
}

/** All `status.jobStatus` for enumerating and sorting */
export const allDataSetJobStatuses: DataSetJobStatus[] = [
  DataSetJobStatus.Running,
  DataSetJobStatus.Success,
  DataSetJobStatus.Failed,
];

/** Enums of keys of `status.errors` */
export enum DataSetErrorType {
  Controller = 'controller',
  Job = 'job',
}

/** Enums of `status.pvcStatus */
export enum DataSetPvcStatus {
  Available = 'Available',
  Bound = 'Bound',
  Released = 'Released',
  Failed = 'Failed',
}

/** All `status.pvcStatus` for enumerating and sorting */
export const allDataSetPvcStatuses: DataSetPvcStatus[] = [
  DataSetPvcStatus.Available,
  DataSetPvcStatus.Bound,
  DataSetPvcStatus.Released,
  DataSetPvcStatus.Failed,
];
