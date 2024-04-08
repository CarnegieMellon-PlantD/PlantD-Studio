import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Form, Input, Radio, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import DateTimePicker from '@/components/resourceManager/DateTimePicker';
import EndpointSelect from '@/components/resourceManager/EndpointSelect';
import { getDefaultExperimentForm } from '@/constants/resourceManager/defaultForm/experiment';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import {
  useCreateExperimentMutation,
  useLazyGetExperimentQuery,
  useUpdateExperimentMutation,
} from '@/services/resourceManager/experimentApi';
import { useListLoadPatternsQuery } from '@/services/resourceManager/loadPatternApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useListPipelinesQuery } from '@/services/resourceManager/pipelineApi';
import { ExperimentVO } from '@/types/resourceManager/experiment';
import { getExperimentDTO, getExperimentVO } from '@/utils/resourceManager/convertExperiment';
import { useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';

const EndpointSpecCard: React.FC<{
  index: number;
}> = ({ index }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();

  return (
    <Card>
      <Form.Item
        noStyle
        shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
          prev.pipelineRef.namespace !== next.pipelineRef.namespace || prev.pipelineRef.name !== next.pipelineRef.name
        }
      >
        {() => (
          <Form.Item
            name={[index, 'endpointName']}
            label={t('Endpoint Name')}
            rules={[{ required: true, message: t('Endpoint name is required') }]}
          >
            <EndpointSelect
              pipelineNamespace={
                form.getFieldValue(['pipelineRef', 'namespace']) as ExperimentVO['pipelineRef']['namespace']
              }
              pipelineName={form.getFieldValue(['pipelineRef', 'name']) as ExperimentVO['pipelineRef']['name']}
            />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item label={t('LoadPattern')} className="mb-0" required>
        <div className="flex gap-1">
          <Form.Item
            className="w-64 flex-auto"
            name={[index, 'loadPatternRef', 'namespace']}
            rules={[{ required: true, message: t('Namespace is required') }]}
          >
            <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
              prev.endpointSpecs[index].loadPatternRef.namespace !== next.endpointSpecs[index]?.loadPatternRef.namespace
            }
          >
            {() => (
              <Form.Item
                className="w-64 flex-auto"
                name={[index, 'loadPatternRef', 'name']}
                rules={[{ required: true, message: t('Name is required') }]}
              >
                <BaseResourceSelect
                  resourceKind={t('LoadPattern')}
                  listHook={useListLoadPatternsQuery}
                  filter={(item) =>
                    item.metadata.namespace ===
                    (form.getFieldValue([
                      'endpointSpecs',
                      index,
                      'loadPatternRef',
                      'namespace',
                    ]) as ExperimentVO['endpointSpecs'][number]['loadPatternRef']['namespace'])
                  }
                />
              </Form.Item>
            )}
          </Form.Item>
        </div>
      </Form.Item>
      <Form.Item name={[index,'dataSpec', 'option']} label={t('Data Option')} required>
        <Radio.Group>
          <Radio value="plainText">{t('Plain Text')}</Radio>
          <Radio value="dataSet">{t('DataSet')}</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
          prev.endpointSpecs[index].dataSpec.option !== next.endpointSpecs[index]?.dataSpec.option
        }
      >
        {() => (
          <>
            {form.getFieldValue(['endpointSpecs', index, 'dataSpec', 'option']) === 'plainText' && (
              <Form.Item
                name={[index, 'dataSpec', 'plainText']}
                label={t('Plain Text')}
                rules={[{ required: true, message: t('Plain text is required') }]}
              >
                <Input.TextArea />
              </Form.Item>
            )}
            {form.getFieldValue(['endpointSpecs', index, 'dataSpec', 'option']) === 'dataSet' && (
              <Form.Item label={t('DataSet')} className="mb-0" required>
                <div className="flex gap-1">
                  <Form.Item
                    className="w-64 flex-auto"
                    name={[index, 'dataSpec', 'dataSetRef', 'namespace']}
                    rules={[{ required: true, message: t('Namespace is required') }]}
                  >
                    <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                  </Form.Item>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
                      prev.endpointSpecs[index].dataSpec.dataSetRef.namespace !==
                      next.endpointSpecs[index]?.dataSpec.dataSetRef.namespace
                    }
                  >
                    {() => (
                      <Form.Item
                        className="w-64 flex-auto"
                        name={[index, 'dataSpec', 'dataSetRef', 'name']}
                        rules={[{ required: true, message: t('Name is required') }]}
                      >
                        <BaseResourceSelect
                          resourceKind={t('DataSet')}
                          listHook={useListDataSetsQuery}
                          filter={(item) =>
                            item.metadata.namespace ===
                            (form.getFieldValue([
                              'endpointSpecs',
                              index,
                              'dataSpec',
                              'dataSetRef',
                              'namespace',
                            ]) as ExperimentVO['endpointSpecs'][number]['dataSpec']['dataSetRef']['namespace'])
                          }
                        />
                      </Form.Item>
                    )}
                  </Form.Item>
                </div>
              </Form.Item>
            )}
          </>
        )}
      </Form.Item>
    </Card>
  );
};

const ExperimentEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Experiment'),
    getDefaultForm: getDefaultExperimentForm,
    lazyGetHook: useLazyGetExperimentQuery,
    createHook: useCreateExperimentMutation,
    updateHook: useUpdateExperimentMutation,
    getVO: getExperimentVO,
    getDTO: getExperimentDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultExperimentForm('')}
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
            <Form.Item className="mb-0" label={t('Pipeline')} required>
              <div className="flex gap-1">
                <Form.Item
                  className="w-64 flex-auto"
                  name={['pipelineRef', 'namespace']}
                  rules={[{ required: true, message: t('Namespace is required') }]}
                >
                  <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
                    prev.pipelineRef.namespace !== next.pipelineRef.namespace
                  }
                >
                  {() => (
                    <Form.Item
                      className="w-64 flex-auto"
                      name={['pipelineRef', 'name']}
                      rules={[{ required: true, message: t('Name is required') }]}
                    >
                      <BaseResourceSelect
                        resourceKind={t('Pipeline')}
                        listHook={useListPipelinesQuery}
                        filter={(item) =>
                          item.metadata.namespace ===
                          (form.getFieldValue(['pipelineRef', 'namespace']) as ExperimentVO['pipelineRef']['namespace'])
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label={t('Endpoint Specs')} required>
              <Form.List
                name={['endpointSpecs']}
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (value.length === 0) {
                        throw new Error(t('At least one endpoint spec is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: endpointSpecIdx }) => (
                      <div key={endpointSpecIdx} className="flex items-center gap-1">
                        <Form.Item className="w-full mb-2">
                          <EndpointSpecCard index={endpointSpecIdx} />
                        </Form.Item>
                        <Form.Item className="mb-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => {
                              remove(endpointSpecIdx);
                            }}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button
                      icon={<FontAwesomeIcon icon={faAdd} />}
                      onClick={() => {
                        const newEndpointSpec: ExperimentVO['endpointSpecs'][number] = {
                          endpointName: '',
                          dataSpec: {
                            option: 'dataSet',
                            plainText: '',
                            dataSetRef: {
                              namespace: '',
                              name: '',
                            },
                          },
                          loadPatternRef: {
                            namespace: '',
                            name: '',
                          },
                        };
                        add(newEndpointSpec);
                      }}
                    >
                      {t('Add')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item name={['hasScheduledTime']} label={t('Scheduling Mode')} required>
              <Radio.Group>
                <Radio value={false}>{t('Immediate')}</Radio>
                <Radio value={true}>{t('Scheduled')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) => prev.hasScheduledTime !== next.hasScheduledTime}
            >
              {() =>
                (form.getFieldValue('hasScheduledTime') as ExperimentVO['hasScheduledTime']) && (
                  <Form.Item
                    label={t('Scheduled Time')}
                    name={['scheduledTime']}
                    rules={[{ required: true, message: t('Scheduled time is required') }]}
                  >
                    <DateTimePicker />
                  </Form.Item>
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

export default ExperimentEditor;
