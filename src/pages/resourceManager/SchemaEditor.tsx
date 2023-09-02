import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { Button, Card, Form, Input, InputNumber, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PartialDeep } from 'type-fest';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import ColumnSelect from '@/components/resourceManager/ColumnSelect';
import FormulaSelect from '@/components/resourceManager/FormulaSelect';
import SortableTable from '@/components/resourceManager/SortableTable';
import TypeSelect from '@/components/resourceManager/TypeSelect';
import { formStyle } from '@/constants/formStyles';
import { rfc1123RegExp } from '@/constants/regExps';
import { getDefaultSchemaForm } from '@/constants/resourceManager/defaultForm/schema';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreateSchemaMutation,
  useLazyGetSchemaQuery,
  useUpdateSchemaMutation,
} from '@/services/resourceManager/schemaApi';
import { SchemaVO } from '@/types/resourceManager/schema';
import { getSchemaDTO, getSchemaVO } from '@/utils/resourceManager/convertSchema';
import { getSchemaColumnArgs } from '@/utils/resourceManager/getSchemaColumnArgs';
import { getSchemaColumnParams } from '@/utils/resourceManager/getSchemaColumnParams';

const SchemaEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['schemaEditor', 'resourceEditor', 'common']);

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('common:schema'),
    getDefaultForm: getDefaultSchemaForm,
    lazyGetHook: useLazyGetSchemaQuery,
    createHook: useCreateSchemaMutation,
    updateHook: useUpdateSchemaMutation,
    getVO: getSchemaVO,
    getDTO: getSchemaDTO,
  });

  const sortableTableColumns: ColumnsType<SchemaVO['columns'][number]> = [
    {
      title: t('columnsTable.nameCol'),
      render: (text, record, index) => (
        <Form.Item
          className="mb-0"
          name={[index, 'name']}
          rules={[{ required: true, message: t('columnsTable.nameRequiredMsg') }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: t('columnsTable.typeCol'),
      width: 250,
      render: (text, record, index) => (
        <Form.Item className="mb-0" name={[index, 'type']} normalize={(value) => (value !== undefined ? value : '')}>
          <TypeSelect allowClear />
        </Form.Item>
      ),
    },
    {
      title: t('columnsTable.paramsCol'),
      width: 300,
      render: (text, record, index) => (
        <Form.List name={[index, 'params']}>
          {(fields) => (
            <div className="flex flex-col gap-1">
              {fields.map(({ name: paramIdx }) => {
                // Should not use `record` because it is not updated unless the whole `SortableTable` is re-rendered
                const paramInfo = form.getFieldValue([
                  'columns',
                  index,
                  'params',
                  paramIdx,
                  'info',
                ]) as SchemaVO['columns'][number]['params'][number]['info'];
                return (
                  <Form.Item
                    key={paramIdx}
                    className="mb-0"
                    label={paramInfo.display}
                    tooltip={
                      <>
                        {/* Description */}
                        <div className="text-xs">{paramInfo.description}</div>
                        {/* Type */}
                        <div className="text-xs">Type: {paramInfo.type}</div>
                        {/* Is optional */}
                        {paramInfo.optional && <div className="text-xs italic">[Optional]</div>}
                        {/* Default value */}
                        {!paramInfo.optional && <div className="text-xs">Default: {paramInfo.default}</div>}
                        {/* Available options */}
                        {paramInfo.options !== null && (
                          <>
                            <div className="text-xs">Available options:</div>
                            {paramInfo.options.map((option, optionIdx) => (
                              <div key={optionIdx} className="text-xs">
                                - {option}
                              </div>
                            ))}
                          </>
                        )}
                      </>
                    }
                    name={[paramIdx, 'value']}
                  >
                    <Input.TextArea autoSize />
                  </Form.Item>
                );
              })}
            </div>
          )}
        </Form.List>
      ),
    },
    {
      title: t('columnsTable.formulaCol'),
      width: 250,
      render: (text, record, index) => (
        <Form.Item className="mb-0" name={[index, 'formula']} normalize={(value) => (value !== undefined ? value : '')}>
          <FormulaSelect allowClear />
        </Form.Item>
      ),
    },
    {
      title: t('columnsTable.argsCol'),
      width: 300,
      render: (text, record, index) => (
        <Form.Item
          noStyle
          shouldUpdate={(prev: SchemaVO, next: SchemaVO) =>
            prev['columns'][index]['args']['info'] !== next['columns'][index]?.['args']['info'] ||
            prev['columns'][index]['name'] !== next['columns'][index]?.['name'] ||
            prev['namespace'] !== next['namespace'] ||
            prev['name'] !== next['name'] ||
            prev['columns'] !== next['columns']
          }
        >
          {() => {
            const info = form.getFieldValue([
              'columns',
              index,
              'args',
              'info',
            ]) as SchemaVO['columns'][number]['args']['info'];
            const schemaNamespace = form.getFieldValue(['namespace']) as SchemaVO['namespace'];
            if (
              info === 'intColumnList' ||
              info === 'floatColumnList' ||
              info === 'stringColumnList' ||
              info === 'boolColumnList'
            ) {
              return (
                <Form.Item
                  className="mb-0"
                  label={t('columnsTable.columnsLabel')}
                  name={[index, 'args', 'value']}
                  required
                  rules={[
                    {
                      type: 'array',
                      min: 1,
                      message: t('columnsTable.columnsNotEmptyMsg'),
                    },
                  ]}
                >
                  <ColumnSelect
                    schemaNamespace={schemaNamespace}
                    schemaName={form.getFieldValue(['name']) as SchemaVO['name']}
                    schemaColumns={form.getFieldValue(['columns']) as SchemaVO['columns']}
                    currentColumnName={
                      form.getFieldValue(['columns', index, 'name']) as SchemaVO['columns'][number]['name']
                    }
                    mode="multiple"
                    allowClear
                  />
                </Form.Item>
              );
            }
            if (info === 'anyColumn') {
              return (
                <Form.Item
                  className="mb-0"
                  label={t('columnsTable.columnLabel')}
                  name={[index, 'args', 'value', 0]}
                  normalize={(value) => (value !== undefined ? value : '')}
                  rules={[{ required: true, message: t('columnsTable.columnRequiredMsg') }]}
                >
                  <ColumnSelect
                    schemaNamespace={schemaNamespace}
                    schemaName={form.getFieldValue(['name']) as SchemaVO['name']}
                    schemaColumns={form.getFieldValue(['columns']) as SchemaVO['columns']}
                    currentColumnName={
                      form.getFieldValue(['columns', index, 'name']) as SchemaVO['columns'][number]['name']
                    }
                  />
                </Form.Item>
              );
            }
            if (info === 'anyColumnWithBoundary') {
              return (
                <div className="flex flex-col gap-1">
                  <Form.Item
                    className="mb-0"
                    label={t('columnsTable.columnLabel')}
                    name={[index, 'args', 'value', 0]}
                    normalize={(value) => (value !== undefined ? value : '')}
                    rules={[{ required: true, message: t('columnsTable.columnRequiredMsg') }]}
                  >
                    <ColumnSelect
                      schemaNamespace={schemaNamespace}
                      schemaName={form.getFieldValue(['name']) as SchemaVO['name']}
                      schemaColumns={form.getFieldValue(['columns']) as SchemaVO['columns']}
                      currentColumnName={
                        form.getFieldValue(['columns', index, 'name']) as SchemaVO['columns'][number]['name']
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    className="mb-0"
                    label={t('columnsTable.minLabel')}
                    name={[index, 'args', 'value', 1]}
                    dependencies={[['columns', index, 'args', 'value', 2]]}
                    rules={[
                      { required: true, message: t('columnsTable.minRequiredMsg') },
                      {
                        validator: async (rule, value) => {
                          const min = Number.parseFloat(value);
                          const max = Number.parseFloat(
                            form.getFieldValue([
                              'columns',
                              index,
                              'args',
                              'value',
                              2,
                            ]) as SchemaVO['columns'][number]['args']['value'][2]
                          );
                          if (min > max) {
                            throw new Error(t('columnsTable.minLEMaxMsg'));
                          }
                        },
                      },
                    ]}
                  >
                    <InputNumber className="w-full" stringMode />
                  </Form.Item>
                  <Form.Item
                    className="mb-0"
                    label={t('columnsTable.maxLabel')}
                    name={[index, 'args', 'value', 2]}
                    dependencies={[['columns', index, 'args', 'value', 1]]}
                    rules={[
                      { required: true, message: t('columnsTable.maxRequiredMsg') },
                      {
                        validator: async (rule, value) => {
                          const min = Number.parseFloat(
                            form.getFieldValue([
                              'columns',
                              index,
                              'args',
                              'value',
                              1,
                            ]) as SchemaVO['columns'][number]['args']['value'][1]
                          );
                          const max = Number.parseFloat(value);
                          if (min > max) {
                            throw new Error(t('columnsTable.maxGEMinMsg'));
                          }
                        },
                      },
                    ]}
                  >
                    <InputNumber className="w-full" stringMode />
                  </Form.Item>
                </div>
              );
            }
            // `info` is 'null'
            return null;
          }}
        </Form.Item>
      ),
    },
  ];

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultSchemaForm('')}
            onValuesChange={(changedValues: PartialDeep<SchemaVO, { recurseIntoArrays: true }>) => {
              // When columns are not changed
              if (changedValues.columns == undefined) {
                return;
              }
              // Get the indices of changed columns
              const changedColumnIdx = changedValues.columns
                .map((column, index) => (column !== undefined ? index : -1))
                .filter((index) => index !== -1);
              // When no column or more than one columns are changed
              if (changedColumnIdx.length !== 1) {
                return;
              }
              // Get the only changed column
              const changedColumn = changedValues.columns[changedColumnIdx[0]] as SchemaVO['columns'][number];
              // When more than one field of the column is changed
              if (Object.keys(changedColumn).length > 1) {
                return;
              }

              // When the `type` of the column is changed, reset `params`
              if (changedColumn.type !== undefined) {
                form.setFieldValue(
                  ['columns', changedColumnIdx[0], 'params'],
                  getSchemaColumnParams(changedColumn.type)
                );
              }

              // When the `formula` of the column is changed, reset `args`
              if (changedColumn.formula !== undefined) {
                form.setFieldValue(
                  ['columns', changedColumnIdx[0], 'args'],
                  getSchemaColumnArgs(changedColumn.formula)
                );
              }
            }}
            onFinish={() => {
              createOrUpdateResource();
            }}
          >
            <Form.Item
              label={t('resourceEditor:namespaceLabel')}
              name={['namespace']}
              normalize={(value) => (value !== undefined ? value : '')}
              rules={[{ required: true, message: t('resourceEditor:namespaceRequiredMsg') }]}
            >
              <BaseResourceSelect
                resourceKindPlural={t('common:namespacePlural')}
                listHook={useListNamespacesQuery}
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item
              label={t('resourceEditor:nameLabel')}
              name={['name']}
              rules={[
                { required: true, message: t('resourceEditor:nameRequiredMsg') },
                {
                  pattern: rfc1123RegExp,
                  message: t('resourceEditor:nameRfc1123Msg'),
                },
              ]}
            >
              <Input
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Card title={t('columnsTable.title')}>
                <Form.List
                  name={['columns']}
                  rules={[
                    {
                      validator: async (rule, value) => {
                        if (value.length === 0) {
                          throw new Error(t('columnsTable.atLeastOneColumnMsg'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove, move }, { errors }) => (
                    <>
                      <SortableTable
                        scroll={{ x: 1450 }}
                        dataSource={form.getFieldValue(['columns']) as SchemaVO['columns']}
                        rowKey="id"
                        columns={sortableTableColumns}
                        onDragEnd={(activeRowKey, overRowKey) => {
                          const activeIndex = (form.getFieldValue(['columns']) as SchemaVO['columns']).findIndex(
                            ({ id }) => id === activeRowKey
                          );
                          const overIndex = (form.getFieldValue(['columns']) as SchemaVO['columns']).findIndex(
                            ({ id }) => id === overRowKey
                          );
                          move(activeIndex, overIndex);
                        }}
                        onCreateRow={() => {
                          // Do manual type checking here
                          const newRow: SchemaVO['columns'][number] = {
                            id: nanoid(),
                            name: '',
                            type: '',
                            params: [],
                            formula: '',
                            args: {
                              info: 'null',
                              value: [],
                            },
                          };
                          add(newRow);
                        }}
                        onDeleteRow={(rowKey) => {
                          const index = (form.getFieldValue(['columns']) as SchemaVO['columns']).findIndex(
                            ({ id }) => id === rowKey
                          );
                          remove(index);
                        }}
                      />
                      <Form.ErrorList errors={errors} />
                    </>
                  )}
                </Form.List>
              </Card>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
              <div className="flex justify-end gap-2">
                <Button type="primary" htmlType="submit" loading={isCreatingOrUpdating}>
                  {t('common:okBtn')}
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    // Go back
                    navigate(-1);
                  }}
                >
                  {t('common:cancelBtn')}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default SchemaEditor;
