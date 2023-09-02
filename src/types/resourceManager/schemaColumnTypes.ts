/** Type definition for the `types` in Schema columns */
export type SchemaColumnTypes = Record<
  string,
  {
    /** Display name */
    display: string;
    /** Category */
    category: string;
    /** Description */
    description: string;
    /** Example output */
    example: string;
    /** Output type in Go */
    output: string;
    /** Output type in HTTP */
    content_type: string;
    /** Available parameters */
    params: Array<{
      /** Name of the parameter */
      field: string;
      /** Display name of the parameter */
      display: string;
      /** Input type of the parameter */
      type: string;
      /** Is the parameter optional */
      optional: boolean;
      /** Default value of the parameter */
      default: string;
      /** Available options of the parameter */
      options: string[] | null;
      /** Description of the parameter */
      description: string;
    }> | null;
  }
>;
