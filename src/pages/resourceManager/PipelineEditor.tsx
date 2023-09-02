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
  const { t } = useTranslation(['pipelineEditor', 'resourceEditor']);

  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ name: idx }) => (
            <div key={idx} className="flex gap-1">
              <Form.Item
                className="w-48 flex-auto mb-2"
                name={[idx, 'key']}
                rules={[{ required: true, message: t('keyRequiredMsg') }]}
              >
                <Input.TextArea autoSize placeholder={t('keyPlaceholder')} />
              </Form.Item>
              <Form.Item
                className="w-96 flex-auto mb-2"
                name={[idx, 'value']}
                rules={[{ required: true, message: t('valueRequiredMsg') }]}
              >
                <Input.TextArea autoSize placeholder={t('valuePlaceholder')} />
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
            {t('resourceEditor:addBtn')}
          </Button>
        </>
      )}
    </Form.List>
  );
};

const EndpointCard: React.FC<{
  name: Array<string | number>;
  fullName: Array<string | number>;
  isMetricsEndpoint: boolean;
}> = ({ name, fullName, isMetricsEndpoint }) => {
  const { t } = useTranslation(['pipelineEditor', 'common']);
  const form = Form.useFormInstance();
  const inCluster = form.getFieldValue(['inCluster']) as PipelineVO['inCluster'];
  const endpointType = form.getFieldValue([...fullName, 'type']) as EndpointVO['type'];
  const bodyType = form.getFieldValue([...fullName, 'http', 'body', 'type']) as EndpointVO['http']['body']['type'];

  return (
    <Card>
      {!isMetricsEndpoint && (
        <Form.Item
          name={[...name, 'name']}
          label={t('endpoint.nameLabel')}
          rules={[{ required: true, message: t('endpoint.nameRequiredMsg') }]}
        >
          <Input />
        </Form.Item>
      )}
      {!(isMetricsEndpoint && inCluster) && (
        <Form.Item
          name={[...name, 'type']}
          label={t('endpoint.protocolLabel')}
          rules={[{ required: true, message: t('endpoint.protocolRequiredMsg') }]}
        >
          <Radio.Group>
            <Radio value="http">{t('endpoint.protocolValues.http')}</Radio>
            <Radio value="websocket" disabled>
              {t('endpoint.protocolValues.websocket')}
            </Radio>
            <Radio value="grpc" disabled>
              {t('endpoint.protocolValues.grpc')}
            </Radio>
          </Radio.Group>
        </Form.Item>
      )}
      {!(isMetricsEndpoint && inCluster) && endpointType === 'http' && (
        <>
          <Form.Item
            name={[...name, 'http', 'url']}
            label={t('endpoint.http.urlLabel')}
            rules={[
              { required: true, message: t('endpoint.http.urlRequiredMsg') },
              { type: 'url', message: t('endpoint.http.urlInvalidMsg') },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={[...name, 'http', 'method']}
            label={t('endpoint.http.methodLabel')}
            rules={[{ required: true, message: t('endpoint.http.methodRequiredMsg') }]}
          >
            <Select
              options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => ({
                label: method,
                value: method,
              }))}
            />
          </Form.Item>
          <Form.Item label={t('endpoint.http.headersLabel')}>
            <KeyValuePair name={[...name, 'http', 'headers']} />
          </Form.Item>
          {!isMetricsEndpoint && (
            <>
              <Form.Item
                name={[...name, 'http', 'body', 'type']}
                label={t('endpoint.http.bodyTypeLabel')}
                rules={[{ required: true, message: t('endpoint.http.bodyTypeRequiredMsg') }]}
              >
                <Radio.Group>
                  <Radio value="data">{t('endpoint.http.bodyTypeValues.data')}</Radio>
                  <Radio value="dataSetRef">{t('endpoint.http.bodyTypeValues.dataSet')}</Radio>
                </Radio.Group>
              </Form.Item>
              {bodyType === 'data' && (
                <Form.Item
                  name={[...name, 'http', 'body', 'data']}
                  label={t('endpoint.http.bodyDataLabel')}
                  rules={[{ required: true, message: t('endpoint.http.bodyDataRequiredMsg') }]}
                >
                  <Input.TextArea />
                </Form.Item>
              )}
              {bodyType === 'dataSetRef' && (
                <>
                  <Form.Item className="mb-0" label={t('endpoint.http.bodyDataSetLabel')} required>
                    <div className="flex gap-1">
                      <Form.Item
                        className="w-full"
                        name={[...name, 'http', 'body', 'dataSetRef', 'namespace']}
                        rules={[{ required: true, message: t('endpoint.http.bodyDataSetNamespaceRequiredMsg') }]}
                      >
                        <BaseResourceSelect
                          resourceKindPlural={t('common:namespacePlural')}
                          listHook={useListNamespacesQuery}
                        />
                      </Form.Item>

                      <Form.Item
                        className="w-full"
                        name={[...name, 'http', 'body', 'dataSetRef', 'name']}
                        rules={[{ required: true, message: t('endpoint.http.bodyDataSetNameRequiredMsg') }]}
                      >
                        <BaseResourceSelect
                          resourceKindPlural={t('common:dataSetPlural')}
                          listHook={useListDataSetsQuery}
                          filter={(item) =>
                            item.metadata.namespace ===
                            (form.getFieldValue([
                              ...fullName,
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
          <Form.Item className="mb-0" label={t('endpoint.serviceLabel')} required>
            <div className="flex gap-1">
              <Form.Item
                className="w-full"
                name={['metricsEndpoint', 'serviceRef', 'namespace']}
                rules={[{ required: true, message: t('endpoint.serviceNamespaceRequiredMsg') }]}
              >
                <BaseResourceSelect
                  resourceKindPlural={t('common:namespacePlural')}
                  listHook={useListNamespacesQuery}
                />
              </Form.Item>
              <Form.Item
                className="w-full"
                name={['metricsEndpoint', 'serviceRef', 'name']}
                rules={[{ required: true, message: t('endpoint.serviceNameRequiredMsg') }]}
              >
                <Input placeholder={t('endpoint.serviceNamePlaceholder')} />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label={t('endpoint.portLabel')}
            name={['metricsEndpoint', 'port']}
            rules={[{ required: true, message: t('endpoint.portRequiredMsg') }]}
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
  const { t } = useTranslation(['pipelineEditor', 'resourceEditor', 'common']);
  const currentNamespace = useSelector((state: RootState) => state.appState.currentNamespace);

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('common:pipeline'),
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
              label={t('resourceEditor:namespaceLabel')}
              name={['namespace']}
              normalize={(value) => (value !== undefined ? value : '')}
              rules={[{ required: true, message: t('resourceEditor:namespaceRequiredMsg') }]}
            >
              <BaseResourceSelect
                resourceKindPlural={t('common:namespacePlural')}
                listHook={useListNamespacesQuery}
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item
              label={t('resourceEditor:nameLabel')}
              name={['name']}
              rules={[
                { required: true, message: t('resourceEditor:nameRequiredMsg') },
                {
                  pattern: rfc1123RegExp,
                  message: t('resourceEditor:nameRfc1123Msg'),
                },
              ]}
            >
              <Input
                // Disable metadata fields if `params.action` is `edit`
                disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item label={t('inClusterLabel')} name={['inCluster']} valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item label={t('pipelineEndpointsLabel')} required>
              <Form.List
                name={['pipelineEndpoints']}
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (value.length === 0) {
                        throw new Error(t('atLeastOneEndpointMsg'));
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
                              name={[endpointIdx]}
                              fullName={['pipelineEndpoints', endpointIdx]}
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
                      {t('resourceEditor:addBtn')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={t('healthCheckEndpointsLabel')}>
              <Form.List name={['healthCheckEndpoints']}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: endpointIndex }) => (
                      <div key={endpointIndex} className="flex items-center gap-1">
                        <Form.Item
                          className="w-full mb-2"
                          name={[endpointIndex]}
                          rules={[
                            { required: true, message: t('healthCheckEndpoint.urlRequiredMsg') },
                            { type: 'url', message: t('healthCheckEndpoint.urlInvalidMsg') },
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
                      {t('resourceEditor:addBtn')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={t('metricsEndpointLabel')}>
              <Form.Item
                shouldUpdate={(prev: PipelineVO, next: PipelineVO) =>
                  prev.inCluster !== next.inCluster || prev.metricsEndpoint !== next.metricsEndpoint
                }
              >
                {() => <EndpointCard name={['metricsEndpoint']} fullName={['metricsEndpoint']} isMetricsEndpoint />}
              </Form.Item>
            </Form.Item>
            <Form.Item label={t('tagsLabel')}>
              <KeyValuePair name={['extraMetrics', 'system', 'tags']} />
            </Form.Item>
            <Form.Item name={['cloudVendor']} label={t('cloudVendorLabel')}>
              <Input />
            </Form.Item>
            <Form.Item name={['enableCostCalculation']} label={t('enableCostCalculationLabel')} valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
              <div className="flex justify-end gap-2">
                <Button type="primary" htmlType="submit" loading={isCreatingOrUpdating}>
                  {t('common:okBtn')}
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {t('common:cancelBtn')}
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
