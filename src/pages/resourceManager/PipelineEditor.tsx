import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { faAdd, faBolt, faCheck, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Button, Card, Checkbox, Form, Input, Radio, Select, Spin } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreatePipelineMutation,
  useLazyGetPipelineQuery,
  useUpdatePipelineMutation,
} from '@/services/resourceManager/pipelineApi';
import { useCheckHTTPHealthMutation, useListServicesQuery } from '@/services/resourceManager/utilApi';
import { PipelineVO } from '@/types/resourceManager/pipeline';
import { getErrMsg } from '@/utils/getErrMsg';
import { getPipelineDTO, getPipelineVO } from '@/utils/resourceManager/convertPipeline';
import { getDefaultPipeline, getDefaultPipelineEndpoint } from '@/utils/resourceManager/defaultPipeline';

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

const PipelineEndpointCard: React.FC<{
  relFormPath: Array<string | number>;
  absFormPath: Array<string | number>;
}> = ({ relFormPath, absFormPath }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const protocol = Form.useWatch(
    [...absFormPath, 'protocol'],
    form
  ) as PipelineVO['pipelineEndpoints'][number]['protocol'];

  return (
    <Card>
      <Form.Item
        name={[...relFormPath, 'name']}
        label={t('Name')}
        rules={[{ required: true, message: t('Name is required') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={[...relFormPath, 'protocol']}
        label={t('Protocol')}
        rules={[{ required: true, message: t('Protocol is required') }]}
      >
        <Radio.Group>
          <Radio value="http">{t('HTTP')}</Radio>
        </Radio.Group>
      </Form.Item>
      {protocol === 'http' && (
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
        </>
      )}
    </Card>
  );
};

const MetricsEndpointCard: React.FC<{
  formPath: Array<string | number>;
}> = ({ formPath }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const inCluster = Form.useWatch(['inCluster'], form) as PipelineVO['inCluster'];

  return (
    <Card>
      {!inCluster && (
        <Form.Item
          name={[...formPath, 'http', 'url']}
          label={t('URL')}
          rules={[
            { required: true, message: t('URL is required') },
            { type: 'url', message: t('Must be a valid URL') },
          ]}
        >
          <Input />
        </Form.Item>
      )}
      {inCluster && (
        <>
          <Form.Item noStyle shouldUpdate={(prev: PipelineVO, next: PipelineVO) => prev.namespace !== next.namespace}>
            {() => (
              <Form.Item
                label={t('Service')}
                name={[...formPath, 'serviceRef', 'name']}
                rules={[{ required: true, message: t('Name is required') }]}
              >
                <BaseResourceSelect
                  resourceKind={t('Service')}
                  listHook={useListServicesQuery}
                  filter={(service) =>
                    service.metadata.namespace === (form.getFieldValue(['namespace']) as PipelineVO['namespace'])
                  }
                />
              </Form.Item>
            )}
          </Form.Item>
          <Form.Item label={t('Port')} name={[...formPath, 'port']}>
            <Input placeholder="metrics" />
          </Form.Item>
          <Form.Item label={t('Path')} name={[...formPath, 'path']}>
            <Input placeholder="/metrics" />
          </Form.Item>
        </>
      )}
    </Card>
  );
};

const HealthCheckURLCard: React.FC<{
  relFormPath: Array<string | number>;
  absFormPath: Array<string | number>;
}> = ({ relFormPath, absFormPath }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const form = Form.useFormInstance();
  const url = Form.useWatch(absFormPath, form) as PipelineVO['healthCheckURLs'][number];

  const [checkHTTPHealth, { isLoading, isSuccess, isError, error, reset }] = useCheckHTTPHealthMutation();

  // Show error message on errors
  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(t('Failed to check health: {error}', { error: getErrMsg(error) }));
    }
  }, [isError, error]);

  // Reset state on URL changes
  useUpdateEffect(() => {
    reset();
  }, [url]);

  return (
    <div className="w-full flex gap-1">
      <Form.Item
        className="w-full mb-2"
        name={relFormPath}
        rules={[
          { required: true, message: t('URL is required') },
          { type: 'url', message: t('Must be a valid URL') },
        ]}
      >
        <Input />
      </Form.Item>
      <Button
        loading={isLoading}
        icon={
          isSuccess ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : isError ? (
            <FontAwesomeIcon icon={faXmark} />
          ) : (
            <FontAwesomeIcon icon={faBolt} />
          )
        }
        className={isSuccess ? 'text-green-500' : isError ? 'text-red-500' : undefined}
        onClick={() => {
          checkHTTPHealth({
            url,
          });
        }}
      >
        {isSuccess ? t('Succeeded') : isError ? t('Failed') : t('Check')}
      </Button>
    </div>
  );
};

const PipelineEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Pipeline'),
    getDefaultForm: getDefaultPipeline,
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
            initialValues={getDefaultPipeline('')}
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
                { max: 55, message: t('Name cannot exceed 55 characters') },
                {
                  pattern: rfc1123RegExp,
                  message: t('Name must be alphanumeric, and may contain "-" and "." in the middle'),
                },
              ]}
            >
              <Input />
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
                            <PipelineEndpointCard
                              relFormPath={[endpointIdx]}
                              absFormPath={['pipelineEndpoints', endpointIdx]}
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
                        add(getDefaultPipelineEndpoint());
                      }}
                    >
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
                {() => <MetricsEndpointCard formPath={['metricsEndpoint']} />}
              </Form.Item>
            </Form.Item>
            <Form.Item label={t('Health Check URLs')}>
              <Form.List name={['healthCheckURLs']}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: endpointIndex }) => (
                      <div key={endpointIndex} className="flex gap-1">
                        <HealthCheckURLCard
                          relFormPath={[endpointIndex]}
                          absFormPath={['healthCheckURLs', endpointIndex]}
                        />
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
            <Form.Item name={['enableCostCalculation']} label={t('Enable Cost Calculation')} valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: PipelineVO, next: PipelineVO) =>
                prev.enableCostCalculation !== next.enableCostCalculation
              }
            >
              {() =>
                (form.getFieldValue(['enableCostCalculation']) as PipelineVO['enableCostCalculation']) && (
                  <>
                    <Form.Item name={['cloudProvider']} label={t('Cloud Service Provider')}>
                      <Select>
                        <Select.Option value="aws">AWS</Select.Option>
                        <Select.Option value="azure">Azure</Select.Option>
                        <Select.Option value="gcp">GCP</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label={t('Tags')}>
                      <KeyValuePair name={['tags']} />
                    </Form.Item>
                  </>
                )
              }
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
