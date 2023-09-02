import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Form, Input, Radio, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import DateTimePicker from '@/components/resourceManager/DateTimePicker';
import { formStyle } from '@/constants/formStyles';
import { rfc1123RegExp } from '@/constants/regExps';
import { getDefaultExperimentForm } from '@/constants/resourceManager/defaultForm/experiment';
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

const ExperimentEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['experimentEditor', 'resourceEditor', 'common']);

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('common:experiment'),
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
            <Form.Item className="mb-0" label={t('pipelineRefLabel')} required>
              <div className="flex gap-1">
                <Form.Item
                  className="w-64 flex-auto"
                  name={['pipelineRef', 'namespace']}
                  rules={[{ required: true, message: t('namespaceRequiredMsg') }]}
                >
                  <BaseResourceSelect
                    resourceKindPlural={t('common:namespacePlural')}
                    listHook={useListNamespacesQuery}
                  />
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
                      rules={[{ required: true, message: t('nameRequiredMsg') }]}
                    >
                      <BaseResourceSelect
                        resourceKindPlural={t('common:pipelinePlural')}
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
            <Form.Item label={t('loadPatternsLabel')} required>
              <Form.List
                name={['loadPatterns']}
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (value.length === 0) {
                        throw new Error(t('atLeastOneLoadPatternMsg'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: loadPatternIdx }) => (
                      <div key={loadPatternIdx} className="flex items-center gap-1">
                        <Form.Item className="w-full mb-2">
                          <Card>
                            <Form.Item
                              name={[loadPatternIdx, 'endpointName']}
                              label={t('loadPattern.endpointNameLabel')}
                              rules={[{ required: true, message: t('loadPattern.endpointNameRequiredMsg') }]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item className="mb-0" label={t('loadPattern.loadPatternRefLabel')} required>
                              <div className="flex gap-1">
                                <Form.Item
                                  className="w-64 flex-auto"
                                  name={[loadPatternIdx, 'loadPatternRef', 'namespace']}
                                  rules={[{ required: true, message: t('namespaceRequiredMsg') }]}
                                >
                                  <BaseResourceSelect
                                    resourceKindPlural={t('common:namespacePlural')}
                                    listHook={useListNamespacesQuery}
                                  />
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) =>
                                    prev.loadPatterns[loadPatternIdx].loadPatternRef.namespace !==
                                    next.loadPatterns[loadPatternIdx]?.loadPatternRef.namespace
                                  }
                                >
                                  {() => (
                                    <Form.Item
                                      className="w-64 flex-auto"
                                      name={[loadPatternIdx, 'loadPatternRef', 'name']}
                                      rules={[{ required: true, message: t('nameRequiredMsg') }]}
                                    >
                                      <BaseResourceSelect
                                        resourceKindPlural={t('common:loadPatternPlural')}
                                        listHook={useListLoadPatternsQuery}
                                        filter={(item) =>
                                          item.metadata.namespace ===
                                          (form.getFieldValue([
                                            'loadPatterns',
                                            loadPatternIdx,
                                            'loadPatternRef',
                                            'namespace',
                                          ]) as ExperimentVO['loadPatterns'][number]['loadPatternRef']['namespace'])
                                        }
                                      />
                                    </Form.Item>
                                  )}
                                </Form.Item>
                              </div>
                            </Form.Item>
                          </Card>
                        </Form.Item>
                        <Form.Item className="mb-2">
                          <Button
                            type="text"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => {
                              remove(loadPatternIdx);
                            }}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button
                      icon={<FontAwesomeIcon icon={faAdd} />}
                      onClick={() => {
                        const newLoadPattern: ExperimentVO['loadPatterns'][number] = {
                          endpointName: '',
                          loadPatternRef: {
                            namespace: '',
                            name: '',
                          },
                        };
                        add(newLoadPattern);
                      }}
                    >
                      {t('resourceEditor:addBtn')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item name={['hasScheduledTime']} label={t('hasScheduledTimeLabel')} required>
              <Radio.Group>
                <Radio value={false}>{t('hasScheduledTimeValues.false')}</Radio>
                <Radio value={true}>{t('hasScheduledTimeValues.true')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: ExperimentVO, next: ExperimentVO) => prev.hasScheduledTime !== next.hasScheduledTime}
            >
              {() =>
                (form.getFieldValue('hasScheduledTime') as ExperimentVO['hasScheduledTime']) && (
                  <Form.Item
                    label={t('scheduledTimeLabel')}
                    name={['scheduledTime']}
                    rules={[{ required: true, message: t('scheduledTimeRequiredMsg') }]}
                  >
                    <DateTimePicker />
                  </Form.Item>
                )
              }
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
              <div className="flex justify-end gap-2">
                <Button type="primary" htmlType="submit" loading={isCreatingOrUpdating}>
                  {t('common:okBtn')}
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    // Go back
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

export default ExperimentEditor;
