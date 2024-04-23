/** Type definition for the metadata of a NetCost */
export type NetCostMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a NetCost */
export type NetCostSpec = {
  netCostPerMB?: string;
  rawDataStoreCostPerMBMonth?: string;
  processedDataStoreCostPerMBMonth?: string;
  rawDataRetentionPolicyMonths?: number;
  processedDataRetentionPolicyMonths?: number;
};

/** Type definition for the status of a NetCost */
export type NetCostStatus = Record<string, never>;

/** Type definition for the data transfer object of a NetCost */
export type NetCostDTO = {
  metadata: NetCostMetadata;
  spec: NetCostSpec;
  status: NetCostStatus | undefined;
};

/** Type definition for the view object of a NetCost */
export type NetCostVO = {
  originalObject: NetCostSpec;
  namespace: string;
  name: string;
  netCostPerMB: string;
  rawDataStoreCostPerMBMonth: string;
  processedDataStoreCostPerMBMonth: string;
  rawDataRetentionPolicyMonths: number;
  processedDataRetentionPolicyMonths: number;
};
