import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { App, Select, SelectProps } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import { useListSchemasQuery } from '@/services/resourceManager/schemaApi';
import { SchemaVO } from '@/types/resourceManager/schema';
import { getErrMsg } from '@/utils/getErrMsg';

interface ColumnSelectProps extends Omit<SelectProps, 'showSearch' | 'loading' | 'options'> {
  /** Namespace of the current Schema */
  schemaNamespace: SchemaVO['namespace'];
  /** Name of the current Schema */
  schemaName: SchemaVO['name'];
  /** Columns of the current Schema */
  schemaColumns: SchemaVO['columns'];
  /** Name of the current column */
  currentColumnName: SchemaVO['columns'][number]['name'];
}

const ColumnSelect: React.FC<ColumnSelectProps> = ({
  schemaNamespace,
  schemaName,
  schemaColumns,
  currentColumnName,
  ...props
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const { data, isFetching, isSuccess, isError, error } = useListSchemasQuery();

  const options = useMemo(() => {
    const currentSchemaColumns =
      schemaName === ''
        ? []
        : schemaColumns
            .filter((column) => column.name !== '' && column.name !== currentColumnName)
            .map((column) => `${schemaName}.${column.name}`);
    const crossSchemaColumns =
      !isSuccess || data === undefined
        ? []
        : data
            .filter((schema) => schema.metadata.namespace === schemaNamespace && schema.metadata.name !== schemaName)
            .map((schema) =>
              schema.spec.columns === undefined
                ? []
                : schema.spec.columns.map((column) => `${schema.metadata.name}.${column.name}`)
            )
            .flat();
    return [...currentSchemaColumns, ...crossSchemaColumns];
  }, [schemaNamespace, schemaName, schemaColumns, currentColumnName, isSuccess, data]);

  // Show error message if failed to list resources
  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(t('Failed to list columns in Schema resources: {error}', { error: getErrMsg(error) }));
    }
  }, [isError, error]);

  return (
    <Select showSearch loading={isFetching} {...props}>
      {options.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};
export default ColumnSelect;
