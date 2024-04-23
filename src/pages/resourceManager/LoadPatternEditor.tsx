import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Spin, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import SortableTable from '@/components/resourceManager/SortableTable';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { durationRegExp, rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import {
  useCreateLoadPatternMutation,
  useLazyGetLoadPatternQuery,
  useUpdateLoadPatternMutation,
} from '@/services/resourceManager/loadPatternApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { LoadPatternVO } from '@/types/resourceManager/loadPattern';
import { getLoadPatternDTO, getLoadPatternVO } from '@/utils/resourceManager/convertLoadPattern';
import { getDefaultLoadPattern, getDefaultLoadPatternStage } from '@/utils/resourceManager/defaultLoadPattern';

const LoadPatternEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('LoadPattern'),
    getDefaultForm: getDefaultLoadPattern,
    lazyGetHook: useLazyGetLoadPatternQuery,
    createHook: useCreateLoadPatternMutation,
    updateHook: useUpdateLoadPatternMutation,
    getVO: getLoadPatternVO,
    getDTO: getLoadPatternDTO,
  });

  const sortableTableColumns: ColumnsType<LoadPatternVO['stages'][number]> = [
    {
      title: t('Target RPS (Requests / Second)'),
      render: (text, record, index) => (
        <Form.Item
          className="mb-0"
          name={[index, 'target']}
          normalize={(value) => (value === null ? 0 : value)}
          rules={[{ type: 'number', min: 0, message: t('Target must be >= 0') }]}
        >
          <InputNumber className="w-full" />
        </Form.Item>
      ),
    },
    {
      title: t('Transition Time'),
      width: 300,
      render: (text, record, index) =>
        // Hide for the first stage
        index !== 0 && (
          <Form.Item
            className="mb-0 w-full"
            name={[index, 'duration']}
            normalize={(value) => (value === null ? 0 : value)}
            rules={[
              { required: true, message: t('Duration is required') },
              { pattern: durationRegExp, message: t('Duration must be in the format of "1h2m3s"') },
            ]}
          >
            <Input className="w-full" />
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
            initialValues={getDefaultLoadPattern('')}
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
                { max: 63, message: t('Name cannot exceed 63 characters') },
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
            <Form.Item wrapperCol={{ span: 24 }}>
              <Card
                title={
                  <span>
                    {t('Stages')}{' '}
                    <Tooltip
                      title={t(
                        'The stages describe the level of load to send over time. The first one specifies the starting load measured in records per second (RPS); subsequent rows specify a new RPS and the amount of time desired to transition to that RPS linearly.'
                      )}
                    >
                      <InfoCircleOutlined className="text-slate-400 dark:text-slate-600" />
                    </Tooltip>
                  </span>
                }
              >
                <Form.List
                  name={['stages']}
                  rules={[
                    {
                      validator: async (rule, value) => {
                        if (value.length < 2) {
                          throw new Error(t('At least two stages are required'));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove, move }, { errors }) => (
                    <>
                      <SortableTable
                        scroll={{ x: 650 }}
                        dataSource={form.getFieldValue(['stages']) as LoadPatternVO['stages']}
                        rowKey="id"
                        columns={sortableTableColumns}
                        onDragEnd={(activeRowKey, overRowKey) => {
                          const activeIndex = (form.getFieldValue(['stages']) as LoadPatternVO['stages']).findIndex(
                            ({ id }) => id === activeRowKey
                          );
                          const overIndex = (form.getFieldValue(['stages']) as LoadPatternVO['stages']).findIndex(
                            ({ id }) => id === overRowKey
                          );
                          move(activeIndex, overIndex);
                        }}
                        onCreateRow={() => {
                          add(getDefaultLoadPatternStage());
                        }}
                        onDeleteRow={(rowKey) => {
                          const index = (form.getFieldValue(['stages']) as LoadPatternVO['stages']).findIndex(
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

export default LoadPatternEditor;
