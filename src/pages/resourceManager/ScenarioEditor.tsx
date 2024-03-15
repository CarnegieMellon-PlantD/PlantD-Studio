import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Checkbox, Form, Input, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
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
import { ScenarioVO } from '@/types/resourceManager/scenario';
import { getScenarioDTO, getScenarioVO } from '@/utils/resourceManager/convertScenario';

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
                // Disable metadata fields if `params.action[ is ](file:///Users/divyaprem/Documents/Work/PlantD-Studio/src/pages/resourceManager/ExperimentEditor.tsx#58%2C62-58%2C62)edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>

            <Form.Item
              label={t('Push frequency High')}
              name={['pushFrequencyPerMonth', 'max']}
              rules={[{ required: true, message: t('Max push frequency per month is required') }]}
            >
              <Input placeholder={t('Enter max push frequency per month')} />
            </Form.Item>

            <Form.Item
              label={t('Push frequency Low')}
              name={['pushFrequencyPerMonth', 'min']}
              rules={[{ required: true, message: t('Min push frequency per month is required') }]}
            >
              <Input placeholder={t('Enter min push frequency per month')} />
            </Form.Item>

            <Form.Item
              label={t('Num devices High')}
              name={['sendingDevices', 'max']}
              rules={[{ required: true, message: t('Max sending devices is required') }]}
            >
              <Input placeholder={t('Enter max sending devices')} />
            </Form.Item>

            <Form.Item
              label={t('Num devices Low')}
              name={['sendingDevices', 'min']}
              rules={[{ required: true, message: t('Min sending devices is required') }]}
            >
              <Input placeholder={t('Enter min sending devices')} />
            </Form.Item>
            <Form.Item
              label={t('Months Relevant')}
              name={['monthsRelevant']}
              rules={[{ required: true, message: t('Months relevant is required') }]}
            >
              <Input placeholder={t('Enter months relevant (comma separated)')} />
            </Form.Item>

            <Form.Item
              label={t('Size (Kb, est)')}
              name={['size']}
              rules={[{ required: true, message: t('Size is required') }]}
            >
              <Input placeholder={t('Enter size')} />
            </Form.Item>
            <Form.Item label={t('File Format')} name={['dataSetConfig', 'fileFormat']}>
              <Input placeholder={t('Enter file format')} />
            </Form.Item>
            <Form.Item
              label={t('Enable Compression')}
              name={['dataSetConfig', 'compressPerSchema']}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item label={t('Compressed File Format')} name={['dataSetConfig', 'compressedFileFormat']}>
              <Input placeholder={t('Enter compressed file format')} />
            </Form.Item>
            <Form.Item
              label={t('Pipeline Namespace')}
              name={['pipelineRef', 'namespace']}
              rules={[{ required: true, message: t('Namespace is required') }]}
            >
              <BaseResourceSelect
                resourceKind={t('Namespace')}
                listHook={useListNamespacesQuery}
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />{' '}
            </Form.Item>

            <Form.Item
              label={t('Pipeline Name')}
              name={['pipelineRef', 'name']}
              rules={[{ required: true, message: t('Name is required') }]}
            >
              <BaseResourceSelect
                resourceKind={t('Pipeline')}
                listHook={useListPipelinesQuery} // replace with the actual hook to list pipelines
                filter={(item) =>
                  item.metadata.namespace ===
                  (form.getFieldValue(['pipelineRef', 'namespace']) as ScenarioVO['pipelineRef']['namespace'])
                }
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

export default ScenarioEditor;
