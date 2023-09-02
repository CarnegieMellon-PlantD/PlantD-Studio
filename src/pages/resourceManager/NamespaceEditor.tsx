import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Input, Spin } from 'antd';

import { formStyle } from '@/constants/formStyles';
import { namespaceNoReservedKeywordRegExp, rfc1123RegExp } from '@/constants/regExps';
import { getDefaultNamespaceForm } from '@/constants/resourceManager/defaultForm/namespace';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useCreateNamespaceMutation } from '@/services/resourceManager/namespaceApi';
import { getNamespaceDTO, getNamespaceVO } from '@/utils/resourceManager/convertNamespace';

const NamespaceEditor: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['namespaceEditor', 'resourceEditor', 'common']);

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('common:namespace'),
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
              label={t('resourceEditor:nameLabel')}
              name={['name']}
              rules={[
                { required: true, message: t('resourceEditor:nameRequiredMsg') },
                {
                  pattern: rfc1123RegExp,
                  message: t('resourceEditor:nameRfc1123Msg'),
                },
                {
                  pattern: namespaceNoReservedKeywordRegExp,
                  message: t('nameNoReservedKeywordMsg'),
                },
              ]}
            >
              <Input />
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

export default NamespaceEditor;
