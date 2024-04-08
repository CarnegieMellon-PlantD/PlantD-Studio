import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Badge, Button, List, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { apiBasePath } from '@/constants';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteDataSetMutation, useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';
import {
  allDataSetJobStatuses,
  allDataSetPvcStatuses,
  DataSetDTO,
  DataSetErrorType,
  DataSetJobStatus,
  DataSetPvcStatus,
} from '@/types/resourceManager/dataSet';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const getTagColorFromCategory = (category: string) => {
  return category === DataSetErrorType.Controller ? 'yellow' : category === DataSetErrorType.Job ? 'red' : '';
};

const ErrorDetail: React.FC<{ record: DataSetDTO }> = ({ record }) => {
  const dataSource = useMemo(
    () =>
      record.status?.errors === undefined
        ? []
        : Object.entries(record.status.errors).flatMap(([category, errors]) =>
            errors.map((error) => ({
              category,
              color: getTagColorFromCategory(category),
              error,
            }))
          ),
    [record.status?.errors]
  );

  return (
    <List
      size="small"
      dataSource={dataSource}
      renderItem={({ category, color, error }) => (
        <List.Item>
          <div className="flex flex-col items-start">
            <Tag className="mb-1" color={color}>
              {category.toUpperCase()}
            </Tag>
            {/* Preserve newlines and spaces and allow text to wrap */}
            <div className="whitespace-pre-wrap">{error}</div>
          </div>
        </List.Item>
      )}
    />
  );
};

const ErrorCount: React.FC<{ record: DataSetDTO }> = ({ record }) => {
  const { t } = useTranslation();
  const { modal } = App.useApp();

  const showErrorDetail = useCallback(
    (record: DataSetDTO) => {
      modal.error({
        title: t('Error Details'),
        content: <ErrorDetail record={record} />,
        width: '500px',
        okText: t('OK'),
      });
    },
    [modal, t]
  );

  return (
    record.status?.errorCount !== undefined &&
    record.status?.errorCount > 0 && (
      <>
        {' '}
        (
        <a
          onClick={() => {
            showErrorDetail(record);
          }}
        >
          {t('{count, plural, one {# Error} other {# Errors}}', { count: record.status.errorCount })}
        </a>
        )
      </>
    )
  );
};

const DataSetList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('DataSet'),
    listHook: useListDataSetsQuery,
    pollingInterval: autoRefreshInterval,
  });

  const columns: ColumnsType<DataSetDTO> = [
    {
      title: t('Name'),
      dataIndex: ['metadata', 'name'],
      sorter: (a, b) => a.metadata.name.localeCompare(b.metadata.name),
    },
    {
      title: t('Namespace'),
      width: 200,
      dataIndex: ['metadata', 'namespace'],
      sorter: (a, b) => sortNamespace(a.metadata.namespace, b.metadata.namespace),
      defaultSortOrder: 'ascend',
    },
    {
      title: t('Schemas'),
      width: 150,
      render: (_, record) => <span>{record.spec.schemas?.length ?? 0}</span>,
      sorter: (a, b) => (a.spec.schemas?.length ?? 0) - (b.spec.schemas?.length ?? 0),
    },
    {
      title: t('Job Status'),
      width: 150,
      render: (text, record) =>
        record.status?.jobStatus === DataSetJobStatus.Running ? (
          <Badge status="processing" text={t('Running')} />
        ) : record.status?.jobStatus === DataSetJobStatus.Success ? (
          <Badge status="success" text={t('Success')} />
        ) : record.status?.jobStatus === DataSetJobStatus.Failed ? (
          <Badge
            status="error"
            text={
              <span>
                {t('Failed')}
                <ErrorCount record={record} />
              </span>
            }
          />
        ) : (
          <Badge status="default" text={record.status?.jobStatus ?? '-'} />
        ),
      filters: [
        { text: t('Running'), value: DataSetJobStatus.Running },
        { text: t('Success'), value: DataSetJobStatus.Success },
        { text: t('Failed'), value: DataSetJobStatus.Failed },
      ],
      onFilter: (value, record) => record.status?.jobStatus === value,
      sorter: (a, b) =>
        allDataSetJobStatuses.indexOf(a.status?.jobStatus as never) -
        allDataSetJobStatuses.indexOf(b.status?.jobStatus as never),
    },
    {
      title: t('Volume Status'),
      width: 150,
      render: (text, record) =>
        record.status?.pvcStatus === DataSetPvcStatus.Available ? (
          <Badge status="warning" text={t('Available')} />
        ) : record.status?.pvcStatus === DataSetPvcStatus.Bound ? (
          <Badge status="success" text={t('Bound')} />
        ) : record.status?.pvcStatus === DataSetPvcStatus.Released ? (
          <Badge status="warning" text={t('Released')} />
        ) : record.status?.pvcStatus === DataSetPvcStatus.Failed ? (
          <Badge status="error" text={t('Failed')} />
        ) : (
          <Badge status="default" text={record.status?.pvcStatus ?? '-'} />
        ),
      filters: [
        {
          text: t('Available'),
          value: DataSetPvcStatus.Available,
        },
        { text: t('Bound'), value: DataSetPvcStatus.Bound },
        {
          text: t('Released'),
          value: DataSetPvcStatus.Released,
        },
        { text: t('Failed'), value: DataSetPvcStatus.Failed },
      ],
      onFilter: (value, record) => record.status?.pvcStatus === value,
      sorter: (a, b) =>
        allDataSetPvcStatuses.indexOf(a.status?.pvcStatus as never) -
        allDataSetPvcStatuses.indexOf(b.status?.pvcStatus as never),
    },
    {
      title: t('Sample Dataset'),
      width: 150,
      render: (text, record) => (
        <Button
          type="text"
          size="small"
          disabled={record.status?.jobStatus !== 'Success'}
          icon={<FontAwesomeIcon icon={faDownload} />}
          onClick={async () => {
            window.open(
              `${apiBasePath}/datasets/sample/${record.metadata.namespace}/${record.metadata.name}`,
              '_blank'
            );
          }}
        >
          {t('Download')}
        </Button>
      ),
    },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('DataSet')}
      resourceKindUrl="dataSet"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteDataSetMutation}
      columns={columns}
      scroll={{ x: 1300 }}
    />
  );
};

export default DataSetList;
