/** Type definition for the metadata of a CostExporter */
export type CostExporterMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a CostExporter */
export type CostExporterSpec = {
  s3Bucket?: string;
  cloudServiceProvider?: string;
  secretRef?: {
    namespace?: string;
    name?: string;
  };
};

/** Type definition for the status of a CostExporter */
export type CostExporterStatus = {
  jobCompletionTime?: string;
  podName?: string;
  jobStatus?: string;
  tags?: string;
};

/** Type definition for the data transfer object of a CostExporter */
export type CostExporterDTO = {
  metadata: CostExporterMetadata;
  spec: CostExporterSpec;
  status: CostExporterStatus | undefined;
};

/** Type definition for the view object of a CostExporter */
export type CostExporterVO = {
  // TODO: implement it
};
