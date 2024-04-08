import { nanoid } from '@reduxjs/toolkit';

import { SchemaDTO, SchemaVO } from '@/types/resourceManager/schema';
import { getSchemaColumnArgs } from '@/utils/resourceManager/getSchemaColumnArgs';
import { getSchemaColumnParams } from '@/utils/resourceManager/getSchemaColumnParams';

/**
 * Convert the data transfer object of a schema to the view object
 * @param schemaDTO The data transfer object of a schema
 * @returns The view object of a schema
 */
export const getSchemaVO = (schemaDTO: SchemaDTO): SchemaVO => {
  return {
    namespace: schemaDTO.metadata.namespace,
    name: schemaDTO.metadata.name,
    columns:
      schemaDTO.spec.columns === undefined
        ? []
        : schemaDTO.spec.columns.map((column) => ({
            id: nanoid(),
            name: column.name,
            type: column.type ?? '',
            params: getSchemaColumnParams(column.type ?? '', column.params),
            formula: column.formula?.name ?? '',
            args: getSchemaColumnArgs(column.formula?.name ?? '', column.formula?.args),
          })),
  };
};

/**
 * Convert the view object of a schema to the data transfer object
 * @param schemaVO The view object of a schema
 * @returns The data transfer object of a schema
 */
export const getSchemaDTO = (schemaVO: SchemaVO): Pick<SchemaDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: schemaVO.namespace,
      name: schemaVO.name,
    },
    spec: {
      columns: schemaVO.columns.map((column) => {
        const filteredParams = column.params.filter(({ value }) => value !== '');

        return {
          name: column.name,
          type: column.type === '' ? undefined : column.type,
          params:
            column.type === '' || filteredParams.length === 0
              ? undefined
              : Object.fromEntries(filteredParams.map(({ info, value }) => [info.field, value])),
          formula:
            column.formula === ''
              ? undefined
              : {
                  name: column.formula,
                  args: column.args.value.length === 0 ? undefined : column.args.value,
                },
        };
      }),
    },
  };
};
