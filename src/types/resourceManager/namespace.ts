/** Type definition for the metadata of a Namespace */
export type NamespaceMetadata = {
  name: string;
};

/** Type definition for the spec of a Namespace */
export type NamespaceSpec = Record<string, never>;

/** Type definition for the status of a Namespace */
export type NamespaceStatus = Record<string, never>;

/** Type definition for the data transfer object of a Namespace */
export type NamespaceDTO = {
  metadata: NamespaceMetadata;
  spec: NamespaceSpec;
  status: NamespaceStatus;
};

/** Type definition for the view object of a Namespace */
export type NamespaceVO = {
  /** Name */
  name: string;
};
