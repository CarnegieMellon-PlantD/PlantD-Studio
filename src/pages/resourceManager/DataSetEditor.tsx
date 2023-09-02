import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { Button, Card, Checkbox, Form, Input, InputNumber, Select, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import SortableTable from '@/components/resourceManager/SortableTable';
import { formStyle } from '@/constants/formStyles';
import { rfc1123RegExp } from '@/constants/regExps';
import { getDefaultDataSetForm } from '@/constants/resourceManager/defaultForm/dataSet';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import {
  useCreateDataSetMutation,
  useLazyGetDataSetQuery,
  useUpdateDataSetMutation,
} from '@/services/resourceManager/dataSetApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useListSchemasQuery } from '@/services/resourceManager/schemaApi';
import { DataSetVO } from '@/types/resourceManager/dataSet';
import { getDataSetDTO, getDataSetVO } from '@/utils/resourceManager/convertDataSet';

const DataSetEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['dataSetEditor', 'resourceEditor', 'common']);

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('common:dataSet'),
    getDefaultForm: getDefaultDataSetForm,
    lazyGetHook: useLazyGetDataSetQuery,
    createHook: useCreateDataSetMutation,
    updateHook: useUpdateDataSetMutation,
    getVO: getDataSetVO,
    getDTO: getDataSetDTO,
  });

  const sortableTableColumns: ColumnsType<DataSetVO['schemas'][number]> = [
    {
      title: t('schemasTable.nameCol'),
      render: (text, record, index) => (
        <Form.Item noStyle shouldUpdate={(prev: DataSetVO, next: DataSetVO) => prev['namespace'] !== next['namespace']}>
          {() => (
            <Form.Item
              className="mb-0"
              name={[index, 'name']}
              rules={[{ required: true, message: t('schemasTable.nameRequiredMsg') }]}
            >
              <BaseResourceSelect
                resourceKindPlural={t('common:schemaPlural')}
                listHook={useListSchemasQuery}
                filter={(schema) =>
                  schema.metadata.namespace === (form.getFieldValue(['namespace']) as DataSetVO['namespace'])
                }
              />
            </Form.Item>
          )}
        </Form.Item>
      ),
    },
    {
      title: t('schemasTable.numRecordsCol'),
      width: 250,
      render: (text, record, index) => (
        <div className="flex flex-col gap-1">
          <Form.Item
            className="mb-0"
            label={t('schemasTable.minLabel')}
            name={[index, 'numRecords', 'min']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'max']]}
            required
            rules={[
              { type: 'number', min: 1, message: t('schemasTable.minGEOneMsg') },
              {
                validator: async (rule, value) => {
                  const min = value;
                  const max = form.getFieldValue([
                    'schemas',
                    index,
                    'numRecords',
                    'max',
                  ]) as DataSetVO['schemas'][number]['numRecords']['max'];
                  if (min > max) {
                    throw new Error(t('schemasTable.minLEMaxMsg'));
                  }
                },
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            className="mb-0"
            label={t('schemasTable.maxLabel')}
            name={[index, 'numRecords', 'max']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'min']]}
            required
            rules={[
              { type: 'number', min: 1, message: t('schemasTable.maxGEOneMsg') },
              {
                validator: async (rule, value) => {
                  const min = form.getFieldValue([
                    'schemas',
                    index,
                    'numRecords',
                    'min',
                  ]) as DataSetVO['schemas'][number]['numRecords']['min'];
                  const max = value;
                  if (min > max) {
                    throw new Error(t('schemasTable.maxGEMinMsg'));
                  }
                },
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: t('schemasTable.numFilesPerCompressedFileCol'),
      width: 250,
      render: (text, record, index) => (
        <Form.Item
          noStyle
          shouldUpdate={(prev: DataSetVO, next: DataSetVO) => prev['useCompression'] !== next['useCompression']}
        >
          {() =>
            (form.getFieldValue(['useCompression']) as DataSetVO['useCompression']) && (
              <div className="flex flex-col gap-1">
                <Form.Item
                  className="mb-0"
                  label={t('schemasTable.minLabel')}
                  name={[index, 'numFilesPerCompressedFile', 'min']}
                  normalize={(value) => (value === null ? 0 : value)}
                  dependencies={[['schemas', index, 'numFilesPerCompressedFile', 'max']]}
                  required
                  rules={[
                    { type: 'number', min: 1, message: t('schemasTable.minGEOneMsg') },
                    {
                      validator: async (rule, value) => {
                        const min = value;
                        const max = form.getFieldValue([
                          'schemas',
                          index,
                          'numFilesPerCompressedFile',
                          'max',
                        ]) as DataSetVO['schemas'][number]['numFilesPerCompressedFile']['max'];
                        if (min > max) {
                          throw new Error(t('schemasTable.minLEMaxMsg'));
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  label={t('schemasTable.maxLabel')}
                  name={[index, 'numFilesPerCompressedFile', 'max']}
                  normalize={(value) => (value === null ? 0 : value)}
                  dependencies={[['schemas', index, 'numFilesPerCompressedFile', 'min']]}
                  required
                  rules={[
                    { type: 'number', min: 1, message: t('schemasTable.maxGEOneMsg') },
                    {
                      validator: async (rule, value) => {
                        const min = form.getFieldValue([
                          'schemas',
                          index,
                          'numFilesPerCompressedFile',
                          'min',
                        ]) as DataSetVO['schemas'][number]['numFilesPerCompressedFile']['min'];
                        const max = value;
                        if (min > max) {
                          throw new Error(t('schemasTable.maxGEMinMsg'));
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
              </div>
            )
          }
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
            initialValues={getDefaultDataSetForm('')}
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
                // Disable metadata fields if action is `edit`
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
                // Disable metadata fields if action is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item
              label={t('numFilesLabel')}
              name={['numFiles']}
              normalize={(value) => (value === null ? 0 : value)}
              required
              rules={[{ type: 'number', min: 1, message: t('numFilesGEOneMsg') }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label={t('fileFormatLabel')}
              name={['fileFormat']}
              rules={[{ required: true, message: t('fileFormatRequiredMsg') }]}
            >
              <Select
                showSearch
                options={[
                  { label: t('fileFormatValues.csv'), value: 'csv' },
                  { label: t('fileFormatValues.binary'), value: 'binary' },
                ]}
              />
            </Form.Item>
            <Form.Item label={t('useCompressionLabel')} name={['useCompression']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: DataSetVO, next: DataSetVO) => prev['useCompression'] !== next['useCompression']}
            >
              {() =>
                (form.getFieldValue(['useCompression']) as DataSetVO['useCompression']) && (
                  <>
                    <Form.Item
                      label={t('compressedFileFormatLabel')}
                      name={['compressedFileFormat']}
                      rules={[{ required: true, message: t('compressedFileFormatRequiredMsg') }]}
                    >
                      <Select showSearch options={[{ label: t('compressedFileFormatValues.zip'), value: 'zip' }]} />
                    </Form.Item>
                    <Form.Item
                      label={t('compressPerSchemaLabel')}
                      tooltip={t('compressPerSchemaTooltip')}
                      name={['compressPerSchema']}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Card title={t('schemasTable.title')}>
                <Form.List
                  name={['schemas']}
                  rules={[
                    {
                      validator: async (rule, value) => {
                        if (value.length === 0) {
                          throw new Error(t('schemasTable.atLeastOneSchemaMsg'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove, move }, { errors }) => (
                    <>
                      <SortableTable
                        scroll={{ x: 850 }}
                        dataSource={form.getFieldValue(['schemas']) as DataSetVO['schemas']}
                        rowKey="id"
                        columns={sortableTableColumns}
                        onDragEnd={(activeRowKey, overRowKey) => {
                          const activeIndex = (form.getFieldValue(['schemas']) as DataSetVO['schemas']).findIndex(
                            ({ id }) => id === activeRowKey
                          );
                          const overIndex = (form.getFieldValue(['schemas']) as DataSetVO['schemas']).findIndex(
                            ({ id }) => id === overRowKey
                          );
                          move(activeIndex, overIndex);
                        }}
                        onCreateRow={() => {
                          // Do manual type checking here
                          const newRow: DataSetVO['schemas'][number] = {
                            id: nanoid(),
                            name: '',
                            numRecords: { min: 1, max: 1 },
                            numFilesPerCompressedFile: { min: 1, max: 1 },
                          };
                          add(newRow);
                        }}
                        onDeleteRow={(rowKey) => {
                          const index = (form.getFieldValue(['schemas']) as DataSetVO['schemas']).findIndex(
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

export default DataSetEditor;
