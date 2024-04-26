import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Form, Input, Radio, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import DateTimePicker from '@/components/resourceManager/DateTimePicker';
import EndpointSelect from '@/components/resourceManager/EndpointSelect';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { durationRegExp, rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';
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
import { getDefaultExperiment, getDefaultExperimentEndpointSpec } from '@/utils/resourceManager/defaultExperiment';

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
          prev.namespace !== next.namespace || prev.pipelineRef.name !== next.pipelineRef.name
        }
      >
        {() => (
          <Form.Item
            name={[index, 'endpointName']}
            label={t('Endpoint Name')}
            rules={[{ required: true, message: t('Endpoint name is required') }]}
          >
            <EndpointSelect
              pipelineNamespace={form.getFieldValue(['namespace']) as ExperimentVO['namespace']}
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
      <Form.Item name={[index, 'dataSpec', 'option']} label={t('Data Option')} required>
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
              <Form.Item
                noStyle
                shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) => prev.namespace !== next.namespace}
              >
                {() => (
                  <Form.Item
                    label={t('DataSet')}
                    name={[index, 'dataSpec', 'dataSetRef', 'name']}
                    rules={[{ required: true, message: t('Name is required') }]}
                  >
                    <BaseResourceSelect
                      resourceKind={t('DataSet')}
                      listHook={useListDataSetsQuery}
                      filter={(item) =>
                        item.metadata.namespace === (form.getFieldValue(['namespace']) as ExperimentVO['namespace'])
                      }
                    />
                  </Form.Item>
                )}
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
    getDefaultForm: getDefaultExperiment,
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
            initialValues={getDefaultExperiment('')}
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
                { max: 32, message: t('Name cannot exceed 32 characters') },
                {
                  pattern: rfc1123RegExp,
                  message: t('Name must be alphanumeric, and may contain "-" and "." in the middle'),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) => prev.namespace !== next.namespace}
            >
              {() => (
                <Form.Item
                  label={t('Pipeline')}
                  name={['pipelineRef', 'name']}
                  rules={[{ required: true, message: t('Name is required') }]}
                >
                  <BaseResourceSelect
                    resourceKind={t('Pipeline')}
                    listHook={useListPipelinesQuery}
                    filter={(item) =>
                      item.metadata.namespace === (form.getFieldValue(['namespace']) as ExperimentVO['namespace'])
                    }
                  />
                </Form.Item>
              )}
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
                        add(
                          getDefaultExperimentEndpointSpec(
                            form.getFieldValue(['namespace']) as ExperimentVO['namespace']
                          )
                        );
                      }}
                    >
                      {t('Add')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item name={['hasScheduledTime']} label={t('Scheduling Mode')}>
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
            <Form.Item name={['drainingMode']} label={t('Draining Mode')}>
              <Radio.Group>
                <Radio value={'endDetection'}>{t('Auto Detect')}</Radio>
                <Radio value={'time'}>{t('Manual')}</Radio>
                <Radio value={'none'}>{t('None')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) => prev.drainingMode !== next.drainingMode}
            >
              {() =>
                (form.getFieldValue('drainingMode') as ExperimentVO['drainingMode']) === 'time' && (
                  <Form.Item
                    label={t('Draining Time')}
                    name={['drainingTime']}
                    rules={[
                      { required: true, message: t('Draining time is required') },
                      { pattern: durationRegExp, message: t('Draining time must be in the format of "1h2m3s"') },
                    ]}
                  >
                    <Input />
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

export default ExperimentEditor;
