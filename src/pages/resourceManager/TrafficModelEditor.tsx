import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Spin, Tooltip, Upload } from 'antd';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { getDefaultTrafficModelForm } from '@/constants/resourceManager/defaultForm/trafficModel';
import { formStyle } from '@/constants/resourceManager/formStyles';
import { rfc1123RegExp } from '@/constants/resourceManager/regExps';
import { useResourceEditor } from '@/hooks/resourceManager/useResourceEditor';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import {
  useCreateTrafficModelMutation,
  useLazyGetTrafficModelQuery,
  useUpdateTrafficModelMutation,
} from '@/services/resourceManager/trafficModelApi';
import { getTrafficModelDTO, getTrafficModelVO } from '@/utils/resourceManager/convertTrafficModel';

const TrafficModelEditor: React.FC = () => {
  const params = useParams();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { breadcrumb, form, createOrUpdateResource, isLoading, isCreatingOrUpdating } = useResourceEditor({
    resourceKind: t('TrafficModel'),
    getDefaultForm: getDefaultTrafficModelForm,
    lazyGetHook: useLazyGetTrafficModelQuery,
    createHook: useCreateTrafficModelMutation,
    updateHook: useUpdateTrafficModelMutation,
    getVO: getTrafficModelVO,
    getDTO: getTrafficModelDTO,
  });

  const beforeUpload = (file: { type: string }) => {
    const isCsv = file.type === 'text/csv';
    if (!isCsv) {
      message.error('You can only upload CSV file!');
    }
    return isCsv;
  };

  const normFile = (e: { fileList: unknown }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div className="p-6">
      {React.cloneElement(breadcrumb, { className: 'mb-6' })}
      <Card bordered={false}>
        <Spin spinning={isLoading}>
          <Form
            {...formStyle}
            form={form}
            initialValues={getDefaultTrafficModelForm('')}
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
              <Input disabled={params.action === 'edit'} />
            </Form.Item>

            <Form.Item label={t('Download CSV')} name={['download_csv']}>
              <div className="flex">
                <Tooltip
                  title={t(
                    'This traffic model lets you describe one forecast of the data your business expects to see as input to your pipeline, over the course of a full year.  To change it, you will have to download this model, edit the parameters, and re-upload it.'
                  )}
                >
                  <InfoCircleOutlined className="text-slate-400 dark:text-slate-600 mr-2" />
                </Tooltip>
                <a href="/utils/traffic_model.csv" download>
                  <Button type="primary">{t('Download CSV')}</Button>
                </a>
              </div>
            </Form.Item>

            <Form.Item
              label={t('Upload CSV')}
              name={['csv']}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: t('CSV file is required') }]}
            >
              <Upload.Dragger name="file" action="/upload.do" beforeUpload={beforeUpload}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">{t('Click or drag file to this area to upload')}</p>
                <p className="ant-upload-hint">{t('Support for a single or bulk upload.')}</p>
              </Upload.Dragger>
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

export default TrafficModelEditor;
