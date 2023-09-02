import { schemaColumnFormulas } from '@/constants/resourceManager/schemaColumnFormulas';
import { SchemaDTO, SchemaVO } from '@/types/resourceManager/schema';

/**
 * Get the `args` field of a Schema column based on its `formula` field and existing args
 * @param formula The `formula` field
 * @param existingArgs The existing args
 * @returns The `args` field
 */
export const getSchemaColumnArgs = (
  formula: string,
  existingArgs: Exclude<
    Exclude<SchemaDTO['spec']['columns'], undefined>[number]['formula'],
    undefined
  >['args'] = undefined
): SchemaVO['columns'][number]['args'] => {
  const info = schemaColumnFormulas.find(({ name }) => name === formula)?.args ?? 'null';
  if (
    info === 'intColumnList' ||
    info === 'floatColumnList' ||
    info === 'stringColumnList' ||
    info === 'boolColumnList'
  ) {
    return {
      info,
      value: existingArgs ?? [],
    };
  }
  if (info === 'anyColumn') {
    return {
      info,
      value: [existingArgs?.[0] ?? ''],
    };
  }
  if (info === 'anyColumnWithBoundary') {
    return {
      info,
      value: [existingArgs?.[0] ?? '', existingArgs?.[1] ?? '', existingArgs?.[2] ?? ''],
    };
  }
  // `info` is 'null'
  return {
    info,
    value: [],
  };
};
