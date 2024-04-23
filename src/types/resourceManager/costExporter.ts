/** Type definition for the metadata of a CostExporter */
export type CostExporterMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a CostExporter */
export type CostExporterSpec = {
  image?: string;
  cloudServiceProvider?: string;
  config?: {
    name?: string;
    key?: string;
  };
};

/** Type definition for the status of a CostExporter */
export type CostExporterStatus = {
  lastSuccess?: string;
  lastFailure?: string;
};

/** Type definition for the data transfer object of a CostExporter */
export type CostExporterDTO = {
  metadata: CostExporterMetadata;
  spec: CostExporterSpec;
  status: CostExporterStatus | undefined;
};

/** Type definition for the view object of a CostExporter */
export type CostExporterVO = {
  originalObject: CostExporterSpec;
  namespace: string;
  name: string;
  cloudServiceProvider: string;
  config: {
    name: string;
    key: string;
  };
};
