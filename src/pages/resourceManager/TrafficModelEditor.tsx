import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { getDefaultTrafficModelForm } from '@/constants/resourceManager/defaultForm/trafficModel';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreateTrafficModelMutation,
  useLazyGetTrafficModelQuery,
  useUpdateTrafficModelMutation,
} from '@/services/resourceManager/trafficModelApi';
import { getTrafficModelDTO, getTrafficModelVO } from '@/utils/resourceManager/convertTrafficModel';

const TrafficModelEditor: React.FC = () => {
  const params = useParams();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('TrafficModel'),
    getDefaultForm: getDefaultTrafficModelForm,
    lazyGetHook: useLazyGetTrafficModelQuery,
    createHook: useCreateTrafficModelMutation,
    updateHook: useUpdateTrafficModelMutation,
    getVO: getTrafficModelVO,
    getDTO: getTrafficModelDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultTrafficModelForm('')}
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

export default TrafficModelEditor;
