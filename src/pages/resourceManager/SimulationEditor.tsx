import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { App, Button, Card, Form, Input, Spin } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useLazyGetDigitalTwinQuery, useListDigitalTwinsQuery } from '@/services/resourceManager/digitalTwinApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useListNetCostsQuery } from '@/services/resourceManager/netCostApi';
import { useListScenariosQuery } from '@/services/resourceManager/scenarioApi';
import {
  useCreateSimulationMutation,
  useLazyGetSimulationQuery,
  useUpdateSimulationMutation,
} from '@/services/resourceManager/simulationApi';
import { useListTrafficModelsQuery } from '@/services/resourceManager/trafficModelApi';
import { DigitalTwinDTO } from '@/types/resourceManager/digitalTwin';
import { SimulationVO } from '@/types/resourceManager/simulation';
import { getErrMsg } from '@/utils/getErrMsg';
import { getSimulationDTO, getSimulationVO } from '@/utils/resourceManager/convertSimulation';
import { getDefaultSimulation } from '@/utils/resourceManager/defaultSimulation';

const SimulationEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { message } = App.useApp();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Simulation'),
    getDefaultForm: getDefaultSimulation,
    lazyGetHook: useLazyGetSimulationQuery,
    createHook: useCreateSimulationMutation,
    updateHook: useUpdateSimulationMutation,
    getVO: getSimulationVO,
    getDTO: getSimulationDTO,
  });

  const digitalTwinNamespace = Form.useWatch(
    ['digitalTwinRef', 'namespace'],
    form
  ) as SimulationVO['digitalTwinRef']['namespace'];
  const digitalTwinName = Form.useWatch(['digitalTwinRef', 'name'], form) as DigitalTwinDTO['metadata']['name'];
  const [
    getDigitalTwin,
    {
      data: digitalTwin,
      isSuccess: isGetDigitalTwinSuccess,
      isError: isGetDigitalTwinError,
      error: getDigitalTwinError,
    },
  ] = useLazyGetDigitalTwinQuery();
  useEffect(() => {
    if (digitalTwinNamespace && digitalTwinName) {
      getDigitalTwin({
        metadata: {
          namespace: digitalTwinNamespace,
          name: digitalTwinName,
        },
      });
    }
  }, [digitalTwinNamespace, digitalTwinName]);
  const isDigitalTwinSchemaAware = useMemo<boolean>(
    () => isGetDigitalTwinSuccess && digitalTwin !== undefined && digitalTwin.spec.digitalTwinType === 'schemaaware',
    [isGetDigitalTwinSuccess, digitalTwin]
  );
  useUpdateEffect(() => {
    if (isGetDigitalTwinError && getDigitalTwinError !== undefined) {
      message.error(
        t('Failed to get {kind} resource: {error}', {
          kind: t('DigitalTwin'),
          error: getErrMsg(getDigitalTwinError),
        })
      );
    }
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultSimulation('')}
            onFinish={() => {
              createOrUpdateResource();
            }}
            // Disable entire form if `params.action` is `edit`
            disabled={params.action === 'edit'}
          >
            <Form.Item
              label={t('Namespace')}
              name={['namespace']}
              normalize={(value) => (value !== undefined ? value : '')}
              rules={[{ required: true, message: t('Namespace is required') }]}
            >
              <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
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
              <Input />
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
            {isDigitalTwinSchemaAware && (
              <Form.Item className="mb-0" label={t('NetCost')}>
                <div className="flex gap-1">
                  <Form.Item className="w-64 flex-auto" name={['netCostRef', 'namespace']}>
                    <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev: SimulationVO, next: SimulationVO) =>
                      prev?.netCostRef?.namespace !== next?.netCostRef?.namespace
                    }
                  >
                    {() => (
                      <Form.Item className="w-64 flex-auto" name={['netCostRef', 'name']}>
                        <BaseResourceSelect
                          resourceKind={t('NetCost')}
                          listHook={useListNetCostsQuery}
                          filter={(item) =>
                            item.metadata.namespace ===
                            (form.getFieldValue(['netCostRef', 'namespace']) as SimulationVO['netCostRef']['namespace'])
                          }
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                </div>
              </Form.Item>
            )}
            {isDigitalTwinSchemaAware && (
              <Form.Item className="mb-0" label={t('Scenario')} required>
                <div className="flex gap-1">
                  <Form.Item
                    className="w-64 flex-auto"
                    name={['scenarioRef', 'namespace']}
                    rules={[{ required: true, message: t('Namespace is required') }]}
                  >
                    <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev: SimulationVO, next: SimulationVO) =>
                      prev?.scenarioRef?.namespace !== next?.scenarioRef?.namespace
                    }
                  >
                    {() => (
                      <Form.Item
                        className="w-64 flex-auto"
                        name={['scenarioRef', 'name']}
                        rules={[{ required: true, message: t('Name is required') }]}
                      >
                        <BaseResourceSelect
                          resourceKind={t('Scenario')}
                          listHook={useListScenariosQuery}
                          filter={(item) =>
                            item.metadata.namespace ===
                            (form.getFieldValue([
                              'scenarioRef',
                              'namespace',
                            ]) as SimulationVO['scenarioRef']['namespace'])
                          }
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                </div>
              </Form.Item>
            )}
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
                  // Override and always enable disable button
                  disabled={false}
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
