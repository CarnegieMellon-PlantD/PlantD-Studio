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
    name?: string;
    type?: string;
    params?: Record<string, string>;
    formula?: {
      name?: string;
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
  originalObject: SchemaSpec;
  namespace: string;
  name: string;
  columns: Array<{
    id: string | number;
    name: string;
    type: string;
    params: Array<{
      info: Exclude<SchemaColumnTypes[string]['params'], null>[number];
      value: string;
    }>;
    formula: string;
    args: {
      info: SchemaColumnFormulas[number]['args'];
      value: string[];
    };
  }>;
};
