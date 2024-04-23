import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import SortableTable from '@/components/resourceManager/SortableTable';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreateScenarioMutation,
  useLazyGetScenarioQuery,
  useUpdateScenarioMutation,
} from '@/services/resourceManager/scenarioApi';
import { useListSchemasQuery } from '@/services/resourceManager/schemaApi';
import { ScenarioVO } from '@/types/resourceManager/scenario';
import { getScenarioDTO, getScenarioVO } from '@/utils/resourceManager/convertScenario';
import { getDefaultScenario, getDefaultScenarioTask } from '@/utils/resourceManager/defaultScenario';

import { InputNumber, Select } from '.store/antd-virtual-f50d7737d7/package';
import { ColumnsType } from '.store/antd-virtual-f50d7737d7/package/es/table';

const ScenarioEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Scenario'),
    getDefaultForm: getDefaultScenario,
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
        <Form.Item noStyle shouldUpdate={(prev: ScenarioVO, next: ScenarioVO) => prev.namespace !== next.namespace}>
          {() => (
            <Form.Item
              name={[index, 'name']}
              className="mb-0"
              rules={[{ required: true, message: t('Name is required') }]}
            >
              <BaseResourceSelect
                resourceKind="Schema"
                listHook={useListSchemasQuery}
                filter={(schema) =>
                  schema.metadata.namespace === (form.getFieldValue(['namespace']) as ScenarioVO['namespace'])
                }
              />
            </Form.Item>
          )}
        </Form.Item>
      ),
    },
    {
      title: 'Size',
      render: (text, record, index) => (
        <Form.Item className="mb-0" name={[index, 'size']} rules={[]}>
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
              { label: t('January'), value: 1 },
              { label: t('February'), value: 2 },
              { label: t('March'), value: 3 },
              { label: t('April'), value: 4 },
              { label: t('May'), value: 5 },
              { label: t('June'), value: 6 },
              { label: t('July'), value: 7 },
              { label: t('August'), value: 8 },
              { label: t('September'), value: 9 },
              { label: t('October'), value: 10 },
              { label: t('November'), value: 11 },
              { label: t('December'), value: 12 },
            ]}
            mode="multiple"
          />
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
            initialValues={getDefaultScenario('')}
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
                          add(getDefaultScenarioTask());
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
