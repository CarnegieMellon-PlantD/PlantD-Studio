import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Badge, Button, List, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { apiBaseUrl } from '@/constants/base';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteDataSetMutation, useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';
import {
  allDataSetJobStatuses,
  allDataSetPvcStatuses,
  DataSetDTO,
  DataSetJobStatus,
  DataSetPvcStatus,
} from '@/types/resourceManager/dataSet';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const tagColorList = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

const ErrorDetail: React.FC<{ record: DataSetDTO }> = ({ record }) => {
  const dataSource = useMemo(
    () =>
      record.status.errors === undefined
        ? []
        : Object.entries(record.status.errors).flatMap(([category, errors], index) =>
            errors.map((error) => [category, tagColorList[index % tagColorList.length], error])
          ),
    [record.status.errors]
  );

  return (
    <List
      size="small"
      dataSource={dataSource}
      renderItem={([category, color, error]) => (
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
  const { t } = useTranslation(['dataSetList']);
  const { modal } = App.useApp();

  const showErrorDetail = useCallback(
    (record: DataSetDTO) => {
      modal.error({
        title: t('errorDetailTitle'),
        content: <ErrorDetail record={record} />,
        width: '500px',
        okText: t('common:okBtn'),
      });
    },
    [modal, t]
  );

  return (
    record.status.errorCount !== undefined &&
    record.status.errorCount > 0 && (
      <>
        {' '}
        (
        <a
          onClick={() => {
            showErrorDetail(record);
          }}
        >
          {record.status.errorCount === 1
            ? t('errorCount', { count: record.status.errorCount })
            : t('errorCountPlural', { count: record.status.errorCount })}
        </a>
        )
      </>
    )
  );
};

const DataSetList: React.FC = () => {
  const { t } = useTranslation(['dataSetList', 'resourceList', 'common']);
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKindPlural: t('common:dataSetPlural'),
    listHook: useListDataSetsQuery,
    pollingInterval: 10000,
  });

  const columns: ColumnsType<DataSetDTO> = [
    {
      title: t('resourceList:nameCol'),
      dataIndex: ['metadata', 'name'],
      sorter: (a, b) => a.metadata.name.localeCompare(b.metadata.name),
    },
    {
      title: t('resourceList:namespaceCol'),
      width: 200,
      dataIndex: ['metadata', 'namespace'],
      sorter: (a, b) => sortNamespace(a.metadata.namespace, b.metadata.namespace),
      defaultSortOrder: 'ascend',
    },
    {
      title: t('numSchemasCol'),
      width: 150,
      render: (text, record) => <span>{record.spec.schemas?.length ?? 0}</span>,
      sorter: (a, b) => (a.spec.schemas?.length ?? 0) - (b.spec.schemas?.length ?? 0),
    },
    {
      title: t('jobStatusCol'),
      width: 150,
      render: (text, record) =>
        record.status.jobStatus === DataSetJobStatus.Creating ? (
          <Badge status="processing" text={t('jobStatusValues.creating')} />
        ) : record.status.jobStatus === DataSetJobStatus.Generating ? (
          <Badge status="processing" text={t('jobStatusValues.generating')} />
        ) : record.status.jobStatus === DataSetJobStatus.Success ? (
          <Badge status="success" text={t('jobStatusValues.success')} />
        ) : record.status.jobStatus === DataSetJobStatus.Failed ? (
          <Badge
            status="error"
            text={
              <span>
                {t('jobStatusValues.failed')}
                <ErrorCount record={record} />
              </span>
            }
          />
        ) : record.status.jobStatus === DataSetJobStatus.Unknown ? (
          <Badge status="warning" text={t('jobStatusValues.unknown')} />
        ) : (
          <Badge status="default" text={record.status.jobStatus ?? t('jobStatusValues.default')} />
        ),
      filters: [
        { text: t('jobStatusValues.creating'), value: DataSetJobStatus.Creating },
        { text: t('jobStatusValues.generating'), value: DataSetJobStatus.Generating },
        { text: t('jobStatusValues.success'), value: DataSetJobStatus.Success },
        { text: t('jobStatusValues.failed'), value: DataSetJobStatus.Failed },
        { text: t('jobStatusValues.unknown'), value: DataSetJobStatus.Unknown },
      ],
      onFilter: (value, record) => record.status.jobStatus === value,
      sorter: (a, b) =>
        allDataSetJobStatuses.indexOf(a.status.jobStatus as never) -
        allDataSetJobStatuses.indexOf(b.status.jobStatus as never),
    },
    {
      title: t('pvcStatusCol'),
      width: 150,
      render: (text, record) =>
        record.status.pvcStatus === DataSetPvcStatus.Available ? (
          <Badge status="warning" text={t('pvcStatusValues.available')} />
        ) : record.status.pvcStatus === DataSetPvcStatus.Bound ? (
          <Badge status="success" text={t('pvcStatusValues.bound')} />
        ) : record.status.pvcStatus === DataSetPvcStatus.Released ? (
          <Badge status="warning" text={t('pvcStatusValues.released')} />
        ) : record.status.pvcStatus === DataSetPvcStatus.Failed ? (
          <Badge status="error" text={t('pvcStatusValues.failed')} />
        ) : (
          <Badge status="default" text={record.status.pvcStatus ?? t('pvcStatusValues.default')} />
        ),
      filters: [
        { text: t('pvcStatusValues.available'), value: DataSetPvcStatus.Available },
        { text: t('pvcStatusValues.bound'), value: DataSetPvcStatus.Bound },
        { text: t('pvcStatusValues.released'), value: DataSetPvcStatus.Released },
        { text: t('pvcStatusValues.failed'), value: DataSetPvcStatus.Failed },
      ],
      onFilter: (value, record) => record.status.pvcStatus === value,
      sorter: (a, b) =>
        allDataSetPvcStatuses.indexOf(a.status.pvcStatus as never) -
        allDataSetPvcStatuses.indexOf(b.status.pvcStatus as never),
    },
    {
      title: t('sampleDataSetCol'),
      width: 150,
      render: (text, record) => (
        <Button
          type="text"
          size="small"
          disabled={record.status.jobStatus !== 'Success'}
          icon={<FontAwesomeIcon icon={faDownload} />}
          onClick={() => {
            window.open(`${apiBaseUrl}/datasets/${record.metadata.namespace}/${record.metadata.name}/sample`, '_blank');
          }}
        >
          {t('downloadBtn')}
        </Button>
      ),
    },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('common:dataSet')}
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
