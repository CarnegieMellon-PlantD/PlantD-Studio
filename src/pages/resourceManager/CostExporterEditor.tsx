import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Button, Card, Form, Input, Select, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import SecretKeySelect from '@/components/resourceManager/SecretKeySelect';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import {
  useCreateCostExporterMutation,
  useLazyGetCostExporterQuery,
  useUpdateCostExporterMutation,
} from '@/services/resourceManager/costExporterApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useListSecretsQuery } from '@/services/resourceManager/utilApi';
import { CostExporterVO } from '@/types/resourceManager/costExporter';
import { getCostExporterDTO, getCostExporterVO } from '@/utils/resourceManager/convertCostExporter';
import { getDefaultCostExporter } from '@/utils/resourceManager/defaultCostExporter';

const CostExporterEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('CostExporter'),
    getDefaultForm: getDefaultCostExporter,
    lazyGetHook: useLazyGetCostExporterQuery,
    createHook: useCreateCostExporterMutation,
    updateHook: useUpdateCostExporterMutation,
    getVO: getCostExporterVO,
    getDTO: getCostExporterDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultCostExporter('')}
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
              name={['cloudServiceProvider']}
              label={t('Cloud Service Provider')}
              rules={[{ required: true, message: t('Cloud service provider is required') }]}
            >
              <Select>
                <Select.Option value="aws">AWS</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: CostExporterVO, next: CostExporterVO) => prev.namespace !== next.namespace}
            >
              {() => (
                <Form.Item
                  name={['config', 'name']}
                  label={t('Secret Name')}
                  rules={[{ required: true, message: t('Secret name is required') }]}
                >
                  <BaseResourceSelect
                    resourceKind={t('Secret')}
                    listHook={useListSecretsQuery}
                    filter={(secret) =>
                      secret.metadata.namespace === (form.getFieldValue(['namespace']) as CostExporterVO['namespace'])
                    }
                  />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: CostExporterVO, next: CostExporterVO) =>
                prev.namespace !== next.namespace || prev.config.name !== next.config.name
              }
            >
              {() => (
                <Form.Item
                  name={['config', 'key']}
                  label={t('Secret Key')}
                  rules={[{ required: true, message: t('Secret key is required') }]}
                >
                  <SecretKeySelect
                    secretNamespace={form.getFieldValue(['namespace']) as string}
                    secretName={form.getFieldValue(['config', 'name']) as string}
                  />
                </Form.Item>
              )}
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

export default CostExporterEditor;
