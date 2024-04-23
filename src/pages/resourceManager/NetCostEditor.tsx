import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Button, Card, Form, Input, InputNumber, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreateNetCostMutation,
  useLazyGetNetCostQuery,
  useUpdateNetCostMutation,
} from '@/services/resourceManager/netCostApi';
import { getNetCostDTO, getNetCostVO } from '@/utils/resourceManager/convertNetCost';
import { getDefaultNetCost } from '@/utils/resourceManager/defaultNetCost';

const NetCostEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('NetCost'),
    getDefaultForm: getDefaultNetCost,
    lazyGetHook: useLazyGetNetCostQuery,
    createHook: useCreateNetCostMutation,
    updateHook: useUpdateNetCostMutation,
    getVO: getNetCostVO,
    getDTO: getNetCostDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultNetCost('')}
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
                { max: 44, message: t('Name cannot exceed 44 characters') },
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
              label={t('Net Cost Per MB')}
              name={['netCostPerMB']}
              rules={[{ required: true, message: t('Net cost per MB is required') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('Raw Data Store Cost Per MB Month')}
              name={['rawDataStoreCostPerMBMonth']}
              rules={[{ required: true, message: t('Raw data store cost per MB month is required') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('Processed Data Store Cost Per MB Month')}
              name={['processedDataStoreCostPerMBMonth']}
              rules={[{ required: true, message: t('Processed data store cost per MB month is required') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('Raw Data Retention Policy Months')}
              name={['rawDataRetentionPolicyMonths']}
              rules={[{ required: true, message: t('Raw data retention policy months is required') }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label={t('Processed Data Retention Policy Months')}
              name={['processedDataRetentionPolicyMonths']}
              rules={[{ required: true, message: t('Processed data retention policy months is required') }]}
            >
              <InputNumber />
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

export default NetCostEditor;
