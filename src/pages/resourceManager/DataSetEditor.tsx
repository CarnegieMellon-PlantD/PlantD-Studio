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
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('DataSet'),
    getDefaultForm: getDefaultDataSetForm,
    lazyGetHook: useLazyGetDataSetQuery,
    createHook: useCreateDataSetMutation,
    updateHook: useUpdateDataSetMutation,
    getVO: getDataSetVO,
    getDTO: getDataSetDTO,
  });

  const sortableTableColumns: ColumnsType<DataSetVO['schemas'][number]> = [
    {
      title: t('Name'),
      render: (text, record, index) => (
        <Form.Item noStyle shouldUpdate={(prev: DataSetVO, next: DataSetVO) => prev['namespace'] !== next['namespace']}>
          {() => (
            <Form.Item
              className="mb-0"
              name={[index, 'name']}
              rules={[{ required: true, message: t('Name is required') }]}
            >
              <BaseResourceSelect
                resourceKind={t('Schema')}
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
      title: t('Records / File'),
      width: 250,
      render: (text, record, index) => (
        <div className="flex flex-col gap-1">
          <Form.Item
            className="mb-0"
            label={t('Min')}
            name={[index, 'numRecords', 'min']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'max']]}
            required
            rules={[
              { type: 'number', min: 1, message: t('Minimum must be >= 1') },
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
                    throw new Error(t('Minimum must be <= maximum'));
                  }
                },
              },
            ]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            className="mb-0"
            label={t('Max')}
            name={[index, 'numRecords', 'max']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'min']]}
            required
            rules={[
              { type: 'number', min: 1, message: t('Maximum must be >= 1') },
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
                    throw new Error(t('Maximum must be >= minimum'));
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
      title: t('Files / Compressed File'),
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
                  label={t('Min')}
                  name={[index, 'numFilesPerCompressedFile', 'min']}
                  normalize={(value) => (value === null ? 0 : value)}
                  dependencies={[['schemas', index, 'numFilesPerCompressedFile', 'max']]}
                  required
                  rules={[
                    { type: 'number', min: 1, message: t('Minimum must be >= 1') },
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
                          throw new Error(t('Minimum must be <= maximum'));
                        }
                      },
                    },
                  ]}
                >
                  <InputNumber className="w-full" />
                </Form.Item>
                <Form.Item
                  className="mb-0"
                  label={t('Max')}
                  name={[index, 'numFilesPerCompressedFile', 'max']}
                  normalize={(value) => (value === null ? 0 : value)}
                  dependencies={[['schemas', index, 'numFilesPerCompressedFile', 'min']]}
                  required
                  rules={[
                    { type: 'number', min: 1, message: t('Maximum must be >= 1') },
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
                          throw new Error(t('Maximum must be >= minimum'));
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
              label={t('Namespace')}
              name={['namespace']}
              normalize={(value) => (value !== undefined ? value : '')}
              rules={[{ required: true, message: t('Namespace is required') }]}
            >
              <BaseResourceSelect
                resourceKind={t('Namespace')}
                listHook={useListNamespacesQuery}
                // Disable metadata fields if action is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item
              label={t('Name')}
              name={['name']}
              rules={[
                { required: true, message: t('Name is required') },
                {
                  pattern: rfc1123RegExp,
                  message: t('Name must be alphanumeric, and may contain "-" and "." in the middle'),
                },
              ]}
            >
              <Input
                // Disable metadata fields if action is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item
              label={t('Number of Files')}
              name={['numFiles']}
              normalize={(value) => (value === null ? 0 : value)}
              required
              rules={[{ type: 'number', min: 1, message: t('Number of files must be >= 1') }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label={t('fileFormatLabel')}
              name={['fileFormat']}
              rules={[{ required: true, message: t('File Format') }]}
            >
              <Select
                showSearch
                options={[
                  { label: '.CSV', value: 'csv' },
                  { label: '.BIN', value: 'binary' },
                ]}
              />
            </Form.Item>
            <Form.Item label={t('Enable Compression')} name={['useCompression']} valuePropName="checked">
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
                      label={t('Compressed File Format')}
                      name={['compressedFileFormat']}
                      rules={[{ required: true, message: t('Compressed file format is required') }]}
                    >
                      <Select showSearch options={[{ label: '.ZIP', value: 'zip' }]} />
                    </Form.Item>
                    <Form.Item
                      label={t('Compress Per Schema')}
                      tooltip={t(
                        'Create a compressed file for each Schema instead of one for all Schemas in every repeat.'
                      )}
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
              <Card title={t('Schemas')}>
                <Form.List
                  name={['schemas']}
                  rules={[
                    {
                      validator: async (rule, value) => {
                        if (value.length === 0) {
                          throw new Error(t('At least one Schema is required'));
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
                  {t('OK')}
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    // Go back
                    navigate(-1);
                  }}
                >
                  {t('Cancel')}
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
