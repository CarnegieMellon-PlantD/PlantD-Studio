import { SchemaColumnFormulas } from '@/types/resourceManager/schemaColumnFormulas';

/** All available `formulas` in Schema columns */
export const schemaColumnFormulas: SchemaColumnFormulas = [
  {
    name: 'AddInt',
    description: 'Sum up int',
    output: 'int',
    args: 'intColumnList',
  },
  {
    name: 'AddFloat',
    description: 'Sum up float',
    output: 'float',
    args: 'floatColumnList',
  },
  {
    name: 'AddString',
    description: 'Concatenate string',
    output: 'string',
    args: 'stringColumnList',
  },
  {
    name: 'And',
    description: 'Apply && Operator',
    output: 'bool',
    args: 'boolColumnList',
  },
  {
    name: 'Or',
    description: 'Apply || Operator',
    output: 'bool',
    args: 'boolColumnList',
  },
  {
    name: 'XOrInt',
    description: 'Apply | Operator',
    output: 'int',
    args: 'intColumnList',
  },
  {
    name: 'Copy',
    description: 'Copy value from given column',
    output: 'interface{}',
    args: 'anyColumn',
  },
  {
    name: 'CurrentTimeMs',
    description: 'Current time in Unix milliseconds',
    output: 'int64',
    args: 'null',
  },
  {
    name: 'ToUnixMilli',
    description: 'Convert date like 2006-01-02 to Unix milliseconds',
    output: 'int64',
    args: 'anyColumn',
  },
  {
    name: 'AddRandomTimeMs',
    description: 'Copy value from given column, and add a random number between minimum and maximum to it',
    output: 'int64',
    args: 'anyColumnWithBoundary',
  },
  {
    name: 'AddRandomNumber',
    description: 'Copy value from given column, and add a random number between minimum and maximum to it',
    output: 'int',
    args: 'anyColumnWithBoundary',
  },
];
