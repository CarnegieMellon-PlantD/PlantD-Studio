import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { faAdd, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Checkbox, Form, Input, Radio, Select, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { defaultNamespace } from '@/constants/base';
import { formStyle } from '@/constants/formStyles';
import { rfc1123RegExp } from '@/constants/regExps';
import { getDefaultEndpoint, getDefaultPipelineForm } from '@/constants/resourceManager/defaultForm/pipeline';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreatePipelineMutation,
  useLazyGetPipelineQuery,
  useUpdatePipelineMutation,
} from '@/services/resourceManager/pipelineApi';
import { RootState } from '@/store';
import { EndpointVO, PipelineVO } from '@/types/resourceManager/pipeline';
import { getPipelineDTO, getPipelineVO } from '@/utils/resourceManager/convertPipeline';

const KeyValuePair: React.FC<{ name: Array<string | number> }> = ({ name }) => {
  const { t } = useTranslation();

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ name: idx }) => (
            <div key={idx} className="flex gap-1">
              <Form.Item
                className="w-48 flex-auto mb-2"
                name={[idx, 'key']}
                rules={[{ required: true, message: t('Key is required') }]}
              >
                <Input.TextArea autoSize placeholder={t('Key')} />
              </Form.Item>
              <Form.Item
                className="w-96 flex-auto mb-2"
                name={[idx, 'value']}
                rules={[{ required: true, message: t('Value is required') }]}
              >
                <Input.TextArea autoSize placeholder={t('Value')} />
              </Form.Item>
              <Form.Item className="mb-2">
                <Button
                  type="text"
                  size="small"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  onClick={() => {
                    remove(idx);
                  }}
                />
              </Form.Item>
            </div>
          ))}
          <Button
            icon={<FontAwesomeIcon icon={faAdd} />}
            onClick={() => {
              add({
                key: '',
                value: '',
              });
            }}
          >
            {t('Add')}
          </Button>
        </>
      )}
    </Form.List>
  );
};

const EndpointCard: React.FC<{
  relFormPath: Array<string | number>;
  absFormPath: Array<string | number>;
  isMetricsEndpoint: boolean;
}> = ({ relFormPath, absFormPath, isMetricsEndpoint }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const inCluster = form.getFieldValue(['inCluster']) as PipelineVO['inCluster'];
  const endpointType = form.getFieldValue([...absFormPath, 'type']) as EndpointVO['type'];
  const bodyType = form.getFieldValue([...absFormPath, 'http', 'body', 'type']) as EndpointVO['http']['body']['type'];

  return (
    <Card>
      {!isMetricsEndpoint && (
        <Form.Item
          name={[...relFormPath, 'name']}
          label={t('Name')}
          rules={[{ required: true, message: t('Name is required') }]}
        >
          <Input />
        </Form.Item>
      )}
      {!(isMetricsEndpoint && inCluster) && (
        <Form.Item
          name={[...relFormPath, 'type']}
          label={t('Protocol')}
          rules={[{ required: true, message: t('Protocol is required') }]}
        >
          <Radio.Group>
            <Radio value="http">{t('HTTP')}</Radio>
            {/* <Radio value="websocket" disabled>
              {t('WebSocket')}
            </Radio>
            <Radio value="grpc" disabled>
              {t('gRPC')}
            </Radio> */}
          </Radio.Group>
        </Form.Item>
      )}
      {!(isMetricsEndpoint && inCluster) && endpointType === 'http' && (
        <>
          <Form.Item
            name={[...relFormPath, 'http', 'url']}
            label={t('URL')}
            rules={[
              { required: true, message: t('URL is required') },
              { type: 'url', message: t('Must be a valid URL') },
            ]}
          >
            <Input />
          </Form.Item>
          {!isMetricsEndpoint && (
            <>
              <Form.Item
                name={[...relFormPath, 'http', 'method']}
                label={t('Method')}
                rules={[{ required: true, message: t('Method is required') }]}
              >
                <Select
                  options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => ({
                    label: method,
                    value: method,
                  }))}
                />
              </Form.Item>
              <Form.Item label={t('Headers')}>
                <KeyValuePair name={[...relFormPath, 'http', 'headers']} />
              </Form.Item>
              <Form.Item
                name={[...relFormPath, 'http', 'body', 'type']}
                label={t('Body Source')}
                rules={[{ required: true, message: t('Body source is required') }]}
              >
                <Radio.Group>
                  <Radio value="data">{t('Manual Input')}</Radio>
                  <Radio value="dataSetRef">{t('DataSet')}</Radio>
                </Radio.Group>
              </Form.Item>
              {bodyType === 'data' && (
                <Form.Item
                  name={[...relFormPath, 'http', 'body', 'data']}
                  label={t('Body')}
                  rules={[{ required: true, message: t('Body is required') }]}
                >
                  <Input.TextArea />
                </Form.Item>
              )}
              {bodyType === 'dataSetRef' && (
                <>
                  <Form.Item className="mb-0" label={t('DataSet')} required>
                    <div className="flex gap-1">
                      <Form.Item
                        className="w-full"
                        name={[...relFormPath, 'http', 'body', 'dataSetRef', 'namespace']}
                        rules={[{ required: true, message: t('Namespace is required') }]}
                      >
                        <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                      </Form.Item>

                      <Form.Item
                        className="w-full"
                        name={[...relFormPath, 'http', 'body', 'dataSetRef', 'name']}
                        rules={[{ required: true, message: t('Name is required') }]}
                      >
                        <BaseResourceSelect
                          resourceKind={t('DataSet')}
                          listHook={useListDataSetsQuery}
                          filter={(item) =>
                            item.metadata.namespace ===
                            (form.getFieldValue([
                              ...absFormPath,
                              'http',
                              'body',
                              'dataSetRef',
                              'namespace',
                            ]) as EndpointVO['http']['body']['dataSetRef']['namespace'])
                          }
                        />
                      </Form.Item>
                    </div>
                  </Form.Item>
                </>
              )}
            </>
          )}
        </>
      )}
      {isMetricsEndpoint && inCluster && (
        <>
          <Form.Item className="mb-0" label={t('Service')} required>
            <div className="flex gap-1">
              <Form.Item
                className="w-full"
                name={['metricsEndpoint', 'serviceRef', 'namespace']}
                rules={[{ required: true, message: t('Namespace is required') }]}
              >
                <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
              </Form.Item>
              <Form.Item
                className="w-full"
                name={['metricsEndpoint', 'serviceRef', 'name']}
                rules={[{ required: true, message: t('Name is required') }]}
              >
                <Input placeholder={t('Service Name')} />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label={t('Port')}
            name={['metricsEndpoint', 'port']}
            rules={[{ required: true, message: t('Port is required') }]}
          >
            <Input />
          </Form.Item>
        </>
      )}
    </Card>
  );
};

const PipelineEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentNamespace = useSelector((state: RootState) => state.appState.currentNamespace);

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Pipeline'),
    getDefaultForm: getDefaultPipelineForm,
    lazyGetHook: useLazyGetPipelineQuery,
    createHook: useCreatePipelineMutation,
    updateHook: useUpdatePipelineMutation,
    getVO: getPipelineVO,
    getDTO: getPipelineDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultPipelineForm('')}
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
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item label={t('In-Cluster Pipeline')} name={['inCluster']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item label={t('Pipeline Endpoints')} required>
              <Form.List
                name={['pipelineEndpoints']}
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (value.length === 0) {
                        throw new Error(t('At least one endpoint is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: endpointIdx }) => (
                      <div key={endpointIdx} className="w-full flex items-center gap-1">
                        <Form.Item
                          className="w-full mb-2"
                          shouldUpdate={(prev: PipelineVO, next: PipelineVO) =>
                            prev.pipelineEndpoints[endpointIdx] !== next.pipelineEndpoints[endpointIdx]
                          }
                        >
                          {() => (
                            <EndpointCard
                              relFormPath={[endpointIdx]}
                              absFormPath={['pipelineEndpoints', endpointIdx]}
                              isMetricsEndpoint={false}
                            />
                          )}
                        </Form.Item>
                        <Form.Item className="mb-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => {
                              remove(endpointIdx);
                            }}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button
                      icon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={() => {
                        add(getDefaultEndpoint(currentNamespace ?? defaultNamespace));
                      }}
                    >
                      {t('Add')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={t('Health Check Endpoints')}>
              <Form.List name={['healthCheckEndpoints']}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: endpointIndex }) => (
                      <div key={endpointIndex} className="flex items-center gap-1">
                        <Form.Item
                          className="w-full mb-2"
                          name={[endpointIndex]}
                          rules={[
                            { required: true, message: t('URL is required') },
                            { type: 'url', message: t('Must be a valid URL') },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item className="mb-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => {
                              remove(endpointIndex);
                            }}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => add('')}>
                      {t('Add')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={t('Metrics Endpoint')}>
              <Form.Item
                shouldUpdate={(prev: PipelineVO, next: PipelineVO) =>
                  prev.inCluster !== next.inCluster || prev.metricsEndpoint !== next.metricsEndpoint
                }
              >
                {() => (
                  <EndpointCard relFormPath={['metricsEndpoint']} absFormPath={['metricsEndpoint']} isMetricsEndpoint />
                )}
              </Form.Item>
            </Form.Item>
            <Form.Item label={t('Tags')}>
              <KeyValuePair name={['extraMetrics', 'system', 'tags']} />
            </Form.Item>
            <Form.Item name={['cloudVendor']} label={t('Cloud Vendor')}>
              <Input />
            </Form.Item>
            <Form.Item name={['enableCostCalculation']} label={t('Enable Cost Calculation')} valuePropName="checked">
              <Checkbox />
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

export default PipelineEditor;
