/** Type definition for the metadata of a Service */
export type ServiceMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Service */
export type ServiceSpec = Record<string, never>;

/** Type definition for the status of a Service */
export type ServiceStatus = Record<string, never>;

/** Type definition for the data transfer object of a Service */
export type ServiceDTO = {
  metadata: ServiceMetadata;
  spec: ServiceSpec;
  status: ServiceStatus | undefined;
};
