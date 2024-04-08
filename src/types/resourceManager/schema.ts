import { SchemaColumnFormulas } from './schemaColumnFormulas';
import { SchemaColumnTypes } from './schemaColumnTypes';

/** Type definition for the metadata of a Schema */
export type SchemaMetadata = {
  namespace: string;
  name: string;
};

/** Type definition for the spec of a Schema */
export type SchemaSpec = {
  columns?: Array<{
    name: string;
    type?: string;
    params?: Record<string, string>;
    formula?: {
      name: string;
      args?: string[];
    };
  }>;
};

/** Type definition for the status of a Schema */
export type SchemaStatus = Record<string, never>;

/** Type definition for the data transfer object of a Schema */
export type SchemaDTO = {
  metadata: SchemaMetadata;
  spec: SchemaSpec;
  status: SchemaStatus | undefined;
};

/** Type definition for the view object of a Schema */
export type SchemaVO = {
  /** Namespace */
  namespace: string;
  /** Name */
  name: string;
  /** Columns */
  columns: Array<{
    /** ID of the column */
    id: string | number;
    /** Name of the column */
    name: string;
    /** Type of the column */
    type: string;
    /** Parameters of the column */
    params: Array<{
      /** Information of the parameter */
      info: Exclude<SchemaColumnTypes[string]['params'], null>[number];
      /** Value of the parameter */
      value: string;
    }>;
    /** Formula of the column */
    formula: string;
    /** Arguments of the column */
    args: {
      /** Information of the argument */
      info: SchemaColumnFormulas[number]['args'];
      /** Value of the argument */
      value: string[];
    };
  }>;
};
