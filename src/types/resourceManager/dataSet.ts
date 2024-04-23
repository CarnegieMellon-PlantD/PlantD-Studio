/** Type definition for the metadata of a DataSet */
export type DataSetMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a DataSet */
export type DataSetSpec = {
  image?: string;
  parallelism?: number;
  storageSize?: string;
  fileFormat?: string;
  compressedFileFormat?: string;
  compressPerSchema?: boolean;
  numFiles?: number;
  schemas?: Array<{
    name?: string;
    numRecords?: {
      min?: number;
      max?: number;
    };
    numFilesPerCompressedFile?: {
      min?: number;
      max?: number;
    };
  }>;
};

/** Type definition for the status of a DataSet */
export type DataSetStatus = {
  jobStatus?: string;
  pvcStatus?: string;
  startTime?: string;
  completionTime?: string;
  errorCount?: number;
  errors?: Record<string, string[]>;
};

/** Type definition for the data transfer object of a DataSet */
export type DataSetDTO = {
  metadata: DataSetMetadata;
  spec: DataSetSpec;
  status: DataSetStatus | undefined;
};

/** Type definition for the view object of a DataSet */
export type DataSetVO = {
  originalObject: DataSetSpec;
  namespace: string;
  name: string;
  fileFormat: string;
  useCompression: boolean;
  compressedFileFormat: string;
  compressPerSchema: boolean;
  numFiles: number;
  schemas: Array<{
    id: string | number;
    name: string;
    numRecords: {
      min: number;
      max: number;
    };
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

/** Enums of `status.errors` keys */
export enum DataSetErrorType {
  Controller = 'controller',
  Job = 'job',
}
