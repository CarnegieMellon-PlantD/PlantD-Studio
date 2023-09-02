/** Type definition for the `formulas` in Schema columns */
export type SchemaColumnFormulas = Array<{
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Output type in Go */
  output: string;
  /** Arguments */
  args:
    | 'intColumnList'
    | 'floatColumnList'
    | 'stringColumnList'
    | 'boolColumnList'
    | 'anyColumn'
    | 'anyColumnWithBoundary'
    | 'null';
}>;
