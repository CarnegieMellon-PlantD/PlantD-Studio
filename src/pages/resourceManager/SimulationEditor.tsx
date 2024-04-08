import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { getDefaultSimulationForm } from '@/constants/resourceManager/defaultForm/simulation';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListDigitalTwinsQuery } from '@/services/resourceManager/digitalTwinApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreateSimulationMutation,
  useLazyGetSimulationQuery,
  useUpdateSimulationMutation,
} from '@/services/resourceManager/simulationApi';
import { useListTrafficModelsQuery } from '@/services/resourceManager/trafficModelApi';
import { SimulationVO } from '@/types/resourceManager/simulation';
import { getSimulationDTO, getSimulationVO } from '@/utils/resourceManager/convertSimulation';

const SimulationEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Simulation'),
    getDefaultForm: getDefaultSimulationForm,
    lazyGetHook: useLazyGetSimulationQuery,
    createHook: useCreateSimulationMutation,
    updateHook: useUpdateSimulationMutation,
    getVO: getSimulationVO,
    getDTO: getSimulationDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultSimulationForm('')}
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
              <Input disabled={params.action === 'edit'} />
            </Form.Item>

            <Form.Item className="mb-0" label={t('DigitalTwin')} required>
              <div className="flex gap-1">
                <Form.Item
                  className="w-64 flex-auto"
                  name={['digitalTwinRef', 'namespace']}
                  rules={[{ required: true, message: t('Namespace is required') }]}
                >
                  <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev: SimulationVO, next: SimulationVO) =>
                    prev?.digitalTwinRef?.namespace !== next?.digitalTwinRef?.namespace
                  }
                >
                  {() => (
                    <Form.Item
                      className="w-64 flex-auto"
                      name={['digitalTwinRef', 'name']}
                      rules={[{ required: true, message: t('Name is required') }]}
                    >
                      <BaseResourceSelect
                        resourceKind={t('DigitalTwin')}
                        listHook={useListDigitalTwinsQuery}
                        disabled={params.action === 'edit'}
                        filter={(item) =>
                          item.metadata.namespace ===
                          (form.getFieldValue([
                            'digitalTwinRef',
                            'namespace',
                          ]) as SimulationVO['digitalTwinRef']['namespace'])
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item className="mb-0" label={t('TrafficModel')} required>
              <div className="flex gap-1">
                <Form.Item
                  className="w-64 flex-auto"
                  name={['trafficModelRef', 'namespace']}
                  rules={[{ required: true, message: t('Namespace is required') }]}
                >
                  <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev: SimulationVO, next: SimulationVO) =>
                    prev?.trafficModelRef?.namespace !== next?.trafficModelRef?.namespace
                  }
                >
                  {() => (
                    <Form.Item
                      className="w-64 flex-auto"
                      name={['trafficModelRef', 'name']}
                      rules={[{ required: true, message: t('Name is required') }]}
                    >
                      <BaseResourceSelect
                        resourceKind={t('trafficModel')}
                        listHook={useListTrafficModelsQuery}
                        disabled={params.action === 'edit'}
                        filter={(item) =>
                          item.metadata.namespace ===
                          (form.getFieldValue([
                            'trafficModelRef',
                            'namespace',
                          ]) as SimulationVO['trafficModelRef']['namespace'])
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
              <div className="flex justify-end gap-2">
                <Button type="primary" htmlType="submit" loading={isCreatingOrUpdating}>
                  {t('OK')}
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
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

export default SimulationEditor;
