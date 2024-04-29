import * as React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { App, Breadcrumb, Button, Card, Checkbox, Form, Spin } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import SecretKeySelect from '@/components/resourceManager/SecretKeySelect';
import { plantDCoreName, plantDCoreNamespace } from '@/constants/resourceManager';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { useGetPlantDCoreQuery, useUpdatePlantDCoreMutation } from '@/services/resourceManager/plantDCoreApi';
import { useListSecretsQuery } from '@/services/resourceManager/utilApi';
import { PlantDCoreVO } from '@/types/resourceManager/plantDCore';
import { getErrMsg } from '@/utils/getErrMsg';
import { getPlantDCoreDTO, getPlantDCoreVO } from '@/utils/resourceManager/convertPlantDCore';
import { getDefaultPlantDCore } from '@/utils/resourceManager/defaultPlantDCore';

const SystemSettings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const { message } = App.useApp();

  const {
    data,
    isFetching: isGetFetching,
    isSuccess: isGetSuccess,
    isError: isGetError,
    error: getError,
  } = useGetPlantDCoreQuery({
    metadata: {
      namespace: plantDCoreNamespace,
      name: plantDCoreName,
    },
  });

  useEffect(() => {
    if (isGetSuccess && data !== undefined) {
      console.log(getPlantDCoreVO(data));
      form.setFieldsValue(getPlantDCoreVO(data));
    }
  }, [isGetSuccess, data]);

  useUpdateEffect(() => {
    if (isGetError && getError !== undefined) {
      message.error(t('Failed to get {kind} resource: {error}', { kind: t('PlantDCore'), error: getErrMsg(getError) }));
    }
  }, [isGetError, getError]);

  const [
    update,
    { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError },
  ] = useUpdatePlantDCoreMutation();

  useUpdateEffect(() => {
    if (isUpdateSuccess) {
      message.success(t('Updated {kind} resource successfully', { kind: t('PlantDCore') }));
      navigate('/');
    }
  }, [isUpdateSuccess]);

  useUpdateEffect(() => {
    if (isUpdateError && updateError !== undefined) {
      message.error(
        t('Failed to update {kind} resource: {error}', { kind: t('PlantDCore'), error: getErrMsg(updateError) })
      );
    }
  }, [isUpdateError, updateError]);
  console.log(form.getFieldsValue(true));
  return (
    <div className="p-6">
      <Breadcrumb
        className="mb-6"
        items={[{ title: t('PlantD Studio') }, { title: t('Tools') }, { title: t('System Settings') }]}
      />
      <Card bordered={false}>
        <Spin spinning={isGetFetching || isUpdateLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultPlantDCore('')}
            onFinish={() => {
              update(getPlantDCoreDTO(form.getFieldsValue(true) as PlantDCoreVO));
            }}
          >
            <Form.Item name={['enableThanos']} label={t('Enabled Thanos')} valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prev: PlantDCoreVO, next: PlantDCoreVO) => prev.enableThanos !== next.enableThanos}
            >
              {() =>
                (form.getFieldValue(['enableThanos']) as PlantDCoreVO['enableThanos']) && (
                  <>
                    <Form.Item
                      name={['thanosObjectStoreConfig', 'name']}
                      label={t('Secret Name')}
                      rules={[{ required: true, message: t('Secret name is required') }]}
                    >
                      <BaseResourceSelect
                        resourceKind={t('Secret')}
                        listHook={useListSecretsQuery}
                        filter={(secret) =>
                          secret.metadata.namespace === (form.getFieldValue(['namespace']) as PlantDCoreVO['namespace'])
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prev: PlantDCoreVO, next: PlantDCoreVO) =>
                        prev.thanosObjectStoreConfig.name !== next.thanosObjectStoreConfig.name
                      }
                    >
                      {() => (
                        <Form.Item
                          name={['thanosObjectStoreConfig', 'key']}
                          label={t('Secret Key')}
                          rules={[{ required: true, message: t('Secret key is required') }]}
                        >
                          <SecretKeySelect
                            secretNamespace={form.getFieldValue(['namespace']) as string}
                            secretName={form.getFieldValue(['thanosObjectStoreConfig', 'name']) as string}
                          />
                        </Form.Item>
                      )}
                    </Form.Item>
                  </>
                )
              }
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }} className="mb-0">
              <div className="flex justify-end gap-2">
                <Button type="primary" htmlType="submit" loading={isUpdateLoading}>
                  {t('OK')}
                </Button>
                <Button
                  htmlType="button"
                  onClick={() => {
                    navigate('/');
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

export default SystemSettings;
