import { nanoid } from '@reduxjs/toolkit';

import { SchemaDTO, SchemaVO } from '@/types/resourceManager/schema';
import { getSchemaColumnArgs } from '@/utils/resourceManager/getSchemaColumnArgs';
import { getSchemaColumnParams } from '@/utils/resourceManager/getSchemaColumnParams';

/**
 * Convert the data transfer object of a Schema to the view object
 * @param dto The data transfer object of a Schema
 * @returns The view object of a Schema
 */
export const getSchemaVO = (dto: SchemaDTO): SchemaVO => {
  const vo: SchemaVO = {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    columns: [],
  };

  if (dto.spec.columns !== undefined) {
    vo.columns = dto.spec.columns.map((column) => ({
      id: nanoid(),
      name: column.name ?? '',
      type: column.type ?? '',
      params: getSchemaColumnParams(column.type ?? '', column.params),
      formula: column.formula?.name ?? '',
      args: getSchemaColumnArgs(column.formula?.name ?? '', column.formula?.args),
    }));
  }

  return vo;
};

/**
 * Convert the view object of a Schema to the data transfer object
 * @param vo The view object of a Schema
 * @returns The data transfer object of a Schema
 */
export const getSchemaDTO = (vo: SchemaVO): Pick<SchemaDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      columns: vo.columns.map((column) => {
        const filteredParams = column.params.filter(({ value }) => value !== '');

        return {
          name: column.name,
          type: column.type !== '' ? column.type : undefined,
          params:
            column.type !== '' && filteredParams.length > 0
              ? Object.fromEntries(filteredParams.map(({ info, value }) => [info.field, value]))
              : undefined,
          formula:
            column.formula !== ''
              ? {
                  name: column.formula,
                  args: column.args.value.length > 0 ? column.args.value : undefined,
                }
              : undefined,
        };
      }),
    },
  };
};
