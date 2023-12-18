import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Spin } from 'antd';

import { getDefaultNamespaceForm } from '@/constants/resourceManager/defaultForm/namespace';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { namespaceNoReservedKeywordRegExp, rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useCreateNamespaceMutation } from '@/services/resourceManager/namespaceApi';
import { getNamespaceDTO, getNamespaceVO } from '@/utils/resourceManager/convertNamespace';

const NamespaceEditor: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('Namespace'),
    getDefaultForm: getDefaultNamespaceForm,
    lazyGetHook: null,
    createHook: useCreateNamespaceMutation,
    updateHook: null,
    getVO: getNamespaceVO,
    getDTO: getNamespaceDTO,
  });

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultNamespaceForm()}
            onFinish={() => {
              createOrUpdateResource();
            }}
          >
            <Form.Item
              label={t('Name')}
              name={['name']}
              rules={[
                { required: true, message: t('Name is required') },
                {
                  pattern: rfc1123RegExp,
                  message: t('Name must be alphanumeric, and may contain "-" and "." in the middle'),
                },
                {
                  pattern: namespaceNoReservedKeywordRegExp,
                  message: t('Name cannot contain reserved words "kube", "system", "manager", or "controller"'),
                },
              ]}
            >
              <Input />
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

export default NamespaceEditor;
