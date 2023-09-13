import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faAdd, faCloudDownload, faCloudUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Breadcrumb, Button, Card, Spin, Table, Upload } from 'antd';
import Alert from 'antd/es/alert/Alert';
import { ColumnsType } from 'antd/es/table';
import { RcFile, UploadFile } from 'antd/es/upload/interface';

import { apiBaseUrl, appName } from '@/constants/base';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';
import { useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import { useListLoadPatternsQuery } from '@/services/resourceManager/loadPatternApi';
import { useListPipelinesQuery } from '@/services/resourceManager/pipelineApi';
import { useListSchemasQuery } from '@/services/resourceManager/schemaApi';
import { useImportResourcesMutation } from '@/services/resourceManager/utilApi';
import { getErrMsg } from '@/utils/getErrMsg';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

/** Enums of resource kinds */
enum Kind {
  Schema = 'Schema',
  DataSet = 'DataSet',
  LoadPattern = 'LoadPattern',
  Pipeline = 'Pipeline',
  Experiment = 'Experiment',
}

type Resource = {
  kind: Kind;
  namespace: string;
  name: string;
};

const getRowKey = (record: Resource) => `${record.kind}/${record.namespace}/${record.name}`;

/** All resource kinds for enumerating and sorting */
const allKinds: Kind[] = [Kind.Schema, Kind.DataSet, Kind.LoadPattern, Kind.Pipeline, Kind.Experiment];

const ImportPanel: React.FC = () => {
  const { t } = useTranslation(['importExport']);
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
            message.warning(t('invalidFileTypeMsg'));
            return Upload.LIST_IGNORE;
          }
          return false;
        }}
      >
        <Button icon={<FontAwesomeIcon icon={faAdd} />}>{t('selectFileBtn')}</Button>
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
        {t('importBtn')}
      </Button>
      {isSuccess && data !== undefined && (
        <>
          {data.numFailed === 0 && (
            <Alert
              className="mt-4"
              type="success"
              message={t('importSuccessMsg', { numSucceeded: data.numSucceeded.toString() })}
              showIcon
            />
          )}
          {data.numFailed > 0 && (
            <Alert
              className="mt-4"
              type="warning"
              message={t('importWarnMsg', {
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
        <Alert className="mt-4" type="error" message={t('importErrorMsg', { error: getErrMsg(error) })} showIcon />
      )}
    </>
  );
};

const ExportPanel: React.FC = () => {
  const { t } = useTranslation(['importExport', 'common']);
  const [selectedRows, setSelectedRows] = useState<Resource[]>([]);

  const { data: schemas, isFetching: isSchemaLoading } = useResourceList({
    resourceKindPlural: t('common:schemaPlural'),
    listHook: useListSchemasQuery,
  });
  const { data: dataSets, isFetching: isDataSetLoading } = useResourceList({
    resourceKindPlural: t('common:dataSetPlural'),
    listHook: useListDataSetsQuery,
  });
  const { data: loadPatterns, isFetching: isLoadPatternLoading } = useResourceList({
    resourceKindPlural: t('common:loadPatternPlural'),
    listHook: useListLoadPatternsQuery,
  });
  const { data: pipelines, isFetching: isPipelineLoading } = useResourceList({
    resourceKindPlural: t('common:pipelinePlural'),
    listHook: useListPipelinesQuery,
  });
  const { data: experiments, isFetching: isExperimentLoading } = useResourceList({
    resourceKindPlural: t('common:experimentPlural'),
    listHook: useListExperimentsQuery,
  });

  const data = useMemo<Resource[]>(
    () => [
      ...(schemas?.map((resource) => ({
        kind: Kind.Schema,
        namespace: resource.metadata.namespace,
        name: resource.metadata.name,
      })) ?? []),
      ...(dataSets?.map((resource) => ({
        kind: Kind.DataSet,
        namespace: resource.metadata.namespace,
        name: resource.metadata.name,
      })) ?? []),
      ...(loadPatterns?.map((resource) => ({
        kind: Kind.LoadPattern,
        namespace: resource.metadata.namespace,
        name: resource.metadata.name,
      })) ?? []),
      ...(pipelines?.map((resource) => ({
        kind: Kind.Pipeline,
        namespace: resource.metadata.namespace,
        name: resource.metadata.name,
      })) ?? []),
      ...(experiments?.map((resource) => ({
        kind: Kind.Experiment,
        namespace: resource.metadata.namespace,
        name: resource.metadata.name,
      })) ?? []),
    ],
    [schemas, dataSets, loadPatterns, pipelines, experiments]
  );

  const isLoading = useMemo(
    () => isSchemaLoading || isDataSetLoading || isLoadPatternLoading || isPipelineLoading || isExperimentLoading,
    [isSchemaLoading, isDataSetLoading, isLoadPatternLoading, isPipelineLoading, isExperimentLoading]
  );

  const getI18nKind = useCallback(
    (kind: Kind) => {
      switch (kind) {
        case Kind.Schema:
          return t('common:schema');
        case Kind.DataSet:
          return t('common:dataSet');
        case Kind.LoadPattern:
          return t('common:loadPattern');
        case Kind.Pipeline:
          return t('common:pipeline');
        case Kind.Experiment:
          return t('common:experiment');
      }
    },
    [t]
  );

  const columns: ColumnsType<Resource> = [
    {
      title: t('kindCol'),
      render: (text, record) => getI18nKind(record.kind),
      filters: allKinds.map((kind) => ({
        text: getI18nKind(kind),
        value: kind,
      })),
      onFilter: (value, record) => record.kind === value,
      sorter: (a, b) => allKinds.indexOf(a.kind) - allKinds.indexOf(b.kind),
    },
    {
      title: t('namespaceCol'),
      dataIndex: 'namespace',
      filters: [...new Set(data.map(({ namespace }) => namespace))].sort(sortNamespace).map((namespace) => ({
        text: namespace,
        value: namespace,
      })),
      onFilter: (value, record) => record.namespace === value,
      sorter: (a, b) => sortNamespace(a.namespace, b.namespace),
      defaultSortOrder: 'ascend',
    },
    {
      title: t('nameCol'),
      dataIndex: 'name',
      sorter: (a, b) => (a.name <= b.name ? -1 : 1),
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <Table
        size="middle"
        dataSource={data}
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
          form.action = `${apiBaseUrl}/export`;
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
        {t('exportBtn')}
      </Button>
    </Spin>
  );
};

const ImportExport: React.FC = () => {
  const { t } = useTranslation(['importExport', 'common']);

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ title: appName }, { title: t('common:tools') }, { title: t('common:importExport') }]}
        className="mb-6"
      />
      <Card title={t('importTitle')} bordered={false} className="mb-6">
        <ImportPanel />
      </Card>
      <Card title={t('exportTitle')} bordered={false}>
        <ExportPanel />
      </Card>
    </div>
  );
};

export default ImportExport;
