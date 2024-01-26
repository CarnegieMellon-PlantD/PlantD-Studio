import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Form, Input, Spin } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import ModelTypeSelect from '@/components/resourceManager/ModelTypeSelect';
import { getDefaultDigitalTwinForm } from '@/constants/resourceManager/defaultForm/digitalTwin';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import {
  useCreateDigitalTwinMutation,
  useLazyGetDigitalTwinQuery,
  useUpdateDigitalTwinMutation,
} from '@/services/resourceManager/digitalTwinApi';
import { useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import { useListLoadPatternsQuery } from '@/services/resourceManager/loadPatternApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { DigitalTwinVO } from '@/types/resourceManager/digitalTwin';
import { getDigitalTwinDTO, getDigitalTwinVO } from '@/utils/resourceManager/convertDigitalTwin';

const DigitalTwinEditor: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('DigitalTwin'),
    getDefaultForm: getDefaultDigitalTwinForm,
    lazyGetHook: useLazyGetDigitalTwinQuery,
    createHook: useCreateDigitalTwinMutation,
    updateHook: useUpdateDigitalTwinMutation,
    getVO: getDigitalTwinVO,
    getDTO: getDigitalTwinDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultDigitalTwinForm('')}
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
              label={t('Model Type')}
              name={['modelType']}
              normalize={(value) => (value !== undefined ? value : '')}
              rules={[{ required: true, message: t('Model type is required') }]}
            >
              <ModelTypeSelect
              // Disable metadata fields if action is `edit`
              // disabled={params.action === 'edit'}
              />
            </Form.Item>
            <Form.Item label={t('LoadPatterns')} required>
              <Form.List
                name={['loadPatterns']}
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (value.length === 0) {
                        throw new Error(t('At least one LoadPattern is required'));
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
                            <Form.Item className="mb-0" label={t('LoadPattern')} required>
                              <div className="flex gap-1">
                                <Form.Item
                                  className="w-64 flex-auto"
                                  name={[loadPatternIdx, 'loadPatternRef', 'namespace']}
                                  rules={[{ required: true, message: t('Namespace is required') }]}
                                >
                                  <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prev: DigitalTwinVO, next: DigitalTwinVO) =>
                                    prev.loadPatterns[loadPatternIdx].loadPatternRef.namespace !==
                                    next.loadPatterns[loadPatternIdx]?.loadPatternRef.namespace
                                  }
                                >
                                  {() => (
                                    <Form.Item
                                      className="w-64 flex-auto"
                                      name={[loadPatternIdx, 'loadPatternRef', 'name']}
                                      rules={[{ required: true, message: t('Name is required') }]}
                                    >
                                      <BaseResourceSelect
                                        resourceKind={t('LoadPattern')}
                                        listHook={useListLoadPatternsQuery}
                                        filter={(item) =>
                                          item.metadata.namespace ===
                                          (form.getFieldValue([
                                            'loadPatterns',
                                            loadPatternIdx,
                                            'loadPatternRef',
                                            'namespace',
                                          ]) as DigitalTwinVO['loadPatterns'][number]['loadPatternRef']['namespace'])
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
                        const newLoadPattern: DigitalTwinVO['loadPatterns'][number] = {
                          endpointName: '',
                          loadPatternRef: {
                            namespace: '',
                            name: '',
                          },
                        };
                        add(newLoadPattern);
                      }}
                    >
                      {t('Add')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item label={t('Experiments')} required>
              <Form.List
                name={['experiments']}
                rules={[
                  {
                    validator: async (rule, value) => {
                      if (value.length === 0) {
                        throw new Error(t('At least one Experiment is required'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map(({ name: experimentIdx }) => (
                      <div key={experimentIdx} className="flex items-center gap-1">
                        <Form.Item className="w-full mb-2">
                          <Card>
                            <Form.Item className="mb-0" label={t('Experiment')} required>
                              <div className="flex gap-1">
                                <Form.Item
                                  className="w-64 flex-auto"
                                  name={[experimentIdx, 'experimentRef', 'namespace']}
                                  rules={[{ required: true, message: t('Namespace is required') }]}
                                >
                                  <BaseResourceSelect resourceKind={t('Namespace')} listHook={useListNamespacesQuery} />
                                </Form.Item>
                                <Form.Item
                                  noStyle
                                  shouldUpdate={(prev: DigitalTwinVO, next: DigitalTwinVO) =>
                                    prev.experiments[experimentIdx].experimentRef.namespace !==
                                    next.experiments[experimentIdx]?.experimentRef.namespace
                                  }
                                >
                                  {() => (
                                    <Form.Item
                                      className="w-64 flex-auto"
                                      name={[experimentIdx, 'experimentRef', 'name']}
                                      rules={[{ required: true, message: t('Name is required') }]}
                                    >
                                      <BaseResourceSelect
                                        resourceKind={t('Experiment')}
                                        listHook={useListExperimentsQuery}
                                        filter={(item) =>
                                          item.metadata.namespace ===
                                          (form.getFieldValue([
                                            'experiments',
                                            experimentIdx,
                                            'experimentRef',
                                            'namespace',
                                          ]) as DigitalTwinVO['experiments'][number]['experimentRef']['namespace'])
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
                              remove(experimentIdx);
                            }}
                          />
                        </Form.Item>
                      </div>
                    ))}
                    <Button
                      icon={<FontAwesomeIcon icon={faAdd} />}
                      onClick={() => {
                        const newExperiment: DigitalTwinVO['experiments'][number] = {
                          endpointName: '',
                          experimentRef: {
                            namespace: '',
                            name: '',
                          },
                        };
                        add(newExperiment);
                      }}
                    >
                      {t('Add')}
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
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

export default DigitalTwinEditor;
