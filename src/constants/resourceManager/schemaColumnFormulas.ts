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
    description: 'Apply &&',
    output: 'bool',
    args: 'boolColumnList',
  },
  {
    name: 'Or',
    description: 'Apply ||',
    output: 'bool',
    args: 'boolColumnList',
  },
  {
    name: 'XOrInt',
    description: 'Apply |',
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
    description: 'Current time in milliseconds',
    output: 'int64',
    args: 'null',
  },
  {
    name: 'ToUnixMilli',
    description: 'Convert Time to Unix Milliseconds',
    output: 'int64',
    args: 'anyColumn',
  },
  {
    name: 'AddRandomTimeMs',
    description: 'Add random milliseconds from range(MIN_NUMBER, MAX_NUMBER)',
    output: 'int64',
    args: 'anyColumnWithBoundary',
  },
  {
    name: 'AddRandomNumber',
    description: 'Add random number from range(MIN_NUMBER, MAX_NUMBER)',
    output: 'int',
    args: 'anyColumnWithBoundary',
  },
];
