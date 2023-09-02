import { schemaColumnTypes } from '@/constants/resourceManager/schemaColumnTypes';
import { SchemaDTO, SchemaVO } from '@/types/resourceManager/schema';

/**
 * Get the `params` field of a Schema column based on its `type` field and existing params
 * @param type The `type` field
 * @param existingParams The existing params
 * @returns The `params` field
 */
export const getSchemaColumnParams = (
  type: string,
  existingParams: Exclude<SchemaDTO['spec']['columns'], undefined>[number]['params'] = undefined
): SchemaVO['columns'][number]['params'] => {
  const result =
    schemaColumnTypes[type]?.params?.map((info) => ({
      info,
      value: existingParams?.[info.field] ?? '',
    })) ?? [];
  // Add params that are not in the `schemaColumnTypes`
  if (existingParams !== undefined) {
    Object.keys(existingParams).forEach((existingParamField) => {
      if (result.find(({ info }) => info.field === existingParamField) === undefined) {
        result.push({
          info: {
            field: existingParamField,
            display: existingParamField,
            type: '',
            optional: false,
            default: '',
            options: null,
            description: '',
          },
          value: existingParams[existingParamField],
        });
      }
    });
  }
  return result;
};
