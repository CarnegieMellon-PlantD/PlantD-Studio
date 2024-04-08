import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import SortableTable from '@/components/resourceManager/SortableTable';
import { getDefaultScenarioForm } from '@/constants/resourceManager/defaultForm/scenario';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useListPipelinesQuery } from '@/services/resourceManager/pipelineApi';
import {
  useCreateScenarioMutation,
  useLazyGetScenarioQuery,
  useUpdateScenarioMutation,
} from '@/services/resourceManager/scenarioApi';
import { ExperimentVO } from '@/types/resourceManager/experiment';
import { ScenarioVO } from '@/types/resourceManager/scenario';
import { getScenarioDTO, getScenarioVO } from '@/utils/resourceManager/convertScenario';

import { nanoid } from '.store/@reduxjs-toolkit-virtual-7845f61885/package';
import { InputNumber, Select } from '.store/antd-virtual-f50d7737d7/package';
import { ColumnsType } from '.store/antd-virtual-f50d7737d7/package/es/table';

const ScenarioEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Scenario'),
    getDefaultForm: getDefaultScenarioForm,
    lazyGetHook: useLazyGetScenarioQuery,
    createHook: useCreateScenarioMutation,
    updateHook: useUpdateScenarioMutation,
    getVO: getScenarioVO,
    getDTO: getScenarioDTO,
  });

  const sortableTableColumns: ColumnsType<ScenarioVO['tasks'][number]> = [
    {
      title: t('Name'),
      render: (text, record, index) => (
        <Form.Item name={[index, 'name']} className="mb-0">
          <Input />
        </Form.Item>
      ),
    },
    {
      title: t('Push Frequency Per Month'),
      width: 250,
      render: (text, record, index) => (
        <div className="flex flex-col gap-1">
          <Form.Item
            className="mb-0"
            label={t('Min')}
            name={[index, 'pushFrequencyPerMonth', 'min']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'max']]}
            required
            rules={[{ type: 'number', min: 1, message: t('Minimum must be >= 1') }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            className="mb-0"
            label={t('Max')}
            name={[index, 'pushFrequencyPerMonth', 'max']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'min']]}
            required
            rules={[{ type: 'number', min: 1, message: t('Maximum must be >= 1') }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: t('Sending Devices'),
      width: 250,
      render: (text, record, index) => (
        <div className="flex flex-col gap-1">
          <Form.Item
            className="mb-0"
            label={t('Min')}
            name={[index, 'sendingDevices', 'min']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'max']]}
            required
            rules={[{ type: 'number', min: 1, message: t('Minimum must be >= 1') }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            className="mb-0"
            label={t('Max')}
            name={[index, 'sendingDevices', 'max']}
            normalize={(value) => (value === null ? 0 : value)}
            dependencies={[['schemas', index, 'numRecords', 'min']]}
            required
            rules={[{ type: 'number', min: 1, message: t('Maximum must be >= 1') }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Months Relevant',
      render: (text, record, index) => (
        <Form.Item className="mb-0" name={[index, 'monthsRelevant']}>
          <Select
            options={[
              { label: 'January', value: 1 },
              { label: 'February', value: 2 },
              { label: 'March', value: 3 },
              { label: 'April', value: 4 },
              { label: 'May', value: 5 },
              { label: 'June', value: 6 },
              { label: 'July', value: 7 },
              { label: 'August', value: 8 },
              { label: 'September', value: 9 },
              { label: 'October', value: 10 },
              { label: 'November', value: 11 },
              { label: 'December', value: 12 },
            ]}
            mode="multiple"
          />
        </Form.Item>
      ),
    },
    {
      title: 'Size',
      render: (text, record, index) => (
        <Form.Item className="mb-0" name={[index, 'size']}>
          <Input />
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
            initialValues={getDefaultScenarioForm('')}
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
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item label={t('Name')} name={['name']} rules={[{ required: true, message: t('Name is required') }]}>
              <Input
                // Disable metadata fields if `params.action is edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>

            <Form.Item className="mb-0" label={t('Pipeline')} required>
              <div className="flex gap-1">
                <Form.Item
                  className="w-64 flex-auto"
                  name={['pipelineRef', 'namespace']}
                  rules={[{ required: true, message: t('Namespace is required') }]}
                >
                  <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
                    prev.pipelineRef.namespace !== next.pipelineRef.namespace
                  }
                >
                  {() => (
                    <Form.Item
                      className="w-64 flex-auto"
                      name={['pipelineRef', 'name']}
                      rules={[{ required: true, message: t('Name is required') }]}
                    >
                      <BaseResourceSelect
                        resourceKind={t('Pipeline')}
                        listHook={useListPipelinesQuery}
                        filter={(item) =>
                          item.metadata.namespace ===
                          (form.getFieldValue(['pipelineRef', 'namespace']) as ExperimentVO['pipelineRef']['namespace'])
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              label={t('File Format')}
              name={['dataSetConfig', 'fileFormat']}
              rules={[{ required: true, message: t('File format is required') }]}
            >
              <Select
                showSearch
                options={[
                  { label: '.CSV', value: 'csv' },
                  { label: '.BIN', value: 'binary' },
                ]}
              />
            </Form.Item>

            <Form.Item
              label={t('Compressed File Format')}
              name={['dataSetConfig', 'compressedFileFormat']}
              rules={[{ required: true, message: t('Compressed file format is required') }]}
            >
              <Select showSearch options={[{ label: '.ZIP', value: 'zip' }]} />
            </Form.Item>

            <Form.Item
              label={t('Compress Per Schema')}
              tooltip={t('Create a compressed file for each Schema instead of one for all Schemas in every repeat.')}
              name={['dataSetConfig', 'compressPerSchema']}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Card title={t('Tasks')}>
                <Form.List
                  name={['tasks']}
                  rules={[
                    {
                      validator: async (rule, value) => {
                        if (value.length === 0) {
                          throw new Error(t('At least one task is required'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove, move }, { errors }) => (
                    <>
                      <SortableTable
                        scroll={{ x: 850 }}
                        dataSource={form.getFieldValue(['tasks']) as ScenarioVO['tasks']}
                        rowKey="id"
                        columns={sortableTableColumns}
                        onDragEnd={(activeRowKey, overRowKey) => {
                          const activeIndex = (form.getFieldValue(['tasks']) as ScenarioVO['tasks']).findIndex(
                            ({ id }) => id === activeRowKey
                          );
                          const overIndex = (form.getFieldValue(['tasks']) as ScenarioVO['tasks']).findIndex(
                            ({ id }) => id === overRowKey
                          );
                          move(activeIndex, overIndex);
                        }}
                        onCreateRow={() => {
                          // Do manual type checking here
                          const newRow: ScenarioVO['tasks'][number] = {
                            id: nanoid(),
                            name: '',
                            monthsRelevant: [],
                            pushFrequencyPerMonth: { min: 0, max: 0 },
                            sendingDevices: { min: 0, max: 0 },
                            size: '',
                          };
                          add(newRow);
                        }}
                        onDeleteRow={(rowKey) => {
                          const index = (form.getFieldValue(['tasks']) as ScenarioVO['tasks']).findIndex(
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

export default ScenarioEditor;
