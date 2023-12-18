import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faAdd, faCloudDownload, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Breadcrumb, Button, Card, Spin, Table, Upload } from 'antd';
import Alert from 'antd/es/alert/Alert';
import { ColumnsType } from 'antd/es/table';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useUpdateEffect } from 'usehooks-ts';

import { apiBasePath } from '@/constants';
import { useGetI18nKind } from '@/hooks/resourceManager/useGetI18nKind';
import {
  useImportResourcesMutation,
  useListKindsQuery,
  useListResourcesQuery,
} from '@/services/resourceManager/utilApi';
import { ResourceLocator } from '@/types/resourceManager/utils';
import { getErrMsg } from '@/utils/getErrMsg';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const getRowKey = (rl: ResourceLocator) => `${rl.kind}/${rl.namespace}/${rl.name}`;

const ImportPanel: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importResources, { data, isSuccess, isError, error }] = useImportResourcesMutation();

  return (
    <>
      <Upload
        maxCount={1}
        fileList={fileList}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList);
        }}
        beforeUpload={(file) => {
          if (!file.name.endsWith('zip')) {
            message.warning(t('Unsupported file type, please select a ZIP file'));
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
      >
        <Button icon={<FontAwesomeIcon icon={faAdd} />}>{t('Select File...')}</Button>
      </Upload>
      <Button
        className="mt-4"
        type="primary"
        icon={<FontAwesomeIcon icon={faCloudUpload} />}
        disabled={fileList.length === 0}
        onClick={() => {
          importResources({ file: fileList[0].originFileObj as RcFile });
        }}
      >
        {t('Import')}
      </Button>
      {isSuccess && data !== undefined && (
        <>
          {data.numFailed === 0 && (
            <Alert
              className="mt-4"
              type="success"
              message={t('Imported {numSucceeded} resources successfully', {
                numSucceeded: data.numSucceeded.toString(),
              })}
              showIcon
            />
          )}
          {data.numFailed > 0 && (
            <Alert
              className="mt-4"
              type="warning"
              message={t('Imported {numSucceeded} resources successfully while {numFailed} errors occurred', {
                numSucceeded: data.numSucceeded.toString(),
                numFailed: data.numFailed.toString(),
              })}
              description={
                <ul>
                  {data.errors.map((error, errorIdx) => (
                    <li key={errorIdx}>{error}</li>
                  ))}
                </ul>
              }
              showIcon
            />
          )}
        </>
      )}
      {isError && error !== undefined && (
        <Alert
          className="mt-4"
          type="error"
          message={t('Failed to import resources {error}', { error: getErrMsg(error) })}
          showIcon
        />
      )}
    </>
  );
};

const ExportPanel: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [selectedRows, setSelectedRows] = useState<ResourceLocator[]>([]);
  const getI18nKind = useGetI18nKind();

  const {
    data: kinds,
    isLoading: isListKindsLoading,
    isError: isListKindsError,
    error: listKindsError,
  } = useListKindsQuery();
  const {
    data: resources,
    isLoading: isListResourcesLoading,
    isError: isListResourcesError,
    error: listResourcesError,
  } = useListResourcesQuery();

  useUpdateEffect(() => {
    if (isListKindsError && listKindsError !== undefined) {
      message.error(t('Failed to list kinds: {error}', { error: getErrMsg(listKindsError) }));
    }
  }, [isListKindsError, listKindsError]);

  useUpdateEffect(() => {
    if (isListResourcesError && listResourcesError !== undefined) {
      message.error(t('Failed to list resources: {error}', { error: getErrMsg(listResourcesError) }));
    }
  }, [isListResourcesError, listResourcesError]);

  const columns: ColumnsType<ResourceLocator> = [
    {
      title: t('Kind'),
      render: (text, record) => getI18nKind(record.kind),
      filters: kinds?.map((kind) => ({
        text: getI18nKind(kind),
        value: kind,
      })),
      onFilter: (value, record) => record.kind === value,
      sorter: kinds === undefined ? undefined : (a, b) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind),
    },
    {
      title: t('Namespace'),
      dataIndex: 'namespace',
      filters:
        resources === undefined
          ? undefined
          : [...new Set(resources.map(({ namespace }) => namespace))].sort(sortNamespace).map((namespace) => ({
              text: namespace,
              value: namespace,
            })),
      onFilter: (value, record) => record.namespace === value,
      sorter: (a, b) => sortNamespace(a.namespace, b.namespace),
      defaultSortOrder: 'ascend',
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: (a, b) => (a.name <= b.name ? -1 : 1),
    },
  ];

  return (
    <Spin spinning={isListKindsLoading || isListResourcesLoading}>
      <Table
        size="middle"
        dataSource={resources}
        rowKey={getRowKey}
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRows.map(getRowKey),
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      <Button
        className="mt-4"
        type="primary"
        icon={<FontAwesomeIcon icon={faCloudDownload} />}
        disabled={selectedRows.length === 0}
        onClick={() => {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = `${apiBasePath}/resources/export`;
          form.style.display = 'none';

          const element = document.createElement('input');
          element.name = 'info';
          element.value = JSON.stringify(selectedRows);
          form.appendChild(element);

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }}
      >
        {t('Export')}
      </Button>
    </Spin>
  );
};

const ImportExport: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ title: 'PlantD Studio' }, { title: t('Tools') }, { title: t('Import/Export') }]}
        className="mb-6"
      />
      <Card title={t('Import Resources')} bordered={false} className="mb-6">
        <ImportPanel />
      </Card>
      <Card title={t('Export Resources')} bordered={false}>
        <ExportPanel />
      </Card>
    </div>
  );
};

export default ImportExport;
