/** Type definition for the metadata of a Secret */
export type SecretMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the data transfer object of a Secret */
export type SecretDTO = {
  metadata: SecretMetadata;
  data?: Record<string, string>;
};
