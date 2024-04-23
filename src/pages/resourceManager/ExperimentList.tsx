import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import ErrorTooltip from '@/components/resourceManager/ErrorTooltip';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteExperimentMutation, useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import { allExperimentJobStatuses, ExperimentDTO, ExperimentJobStatus } from '@/types/resourceManager/experiment';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const ExperimentList: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Experiment'),
    listHook: useListExperimentsQuery,
    pollingInterval: autoRefreshInterval,
  });

  const columns: ColumnsType<ExperimentDTO> = [
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
      title: t('Durations'),
      width: 150,
      render: (text, record) =>
        record.status?.durations !== undefined
          ? Object.entries(record.status?.durations)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : '-',
    },
    {
      title: t('Status'),
      width: 150,
      render: (text, record) =>
        record.status?.jobStatus === ExperimentJobStatus.Scheduled ? (
          <Badge status="warning" text={t('Scheduled')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.WaitingDataSet ? (
          <Badge status="warning" text={t('Waiting for DataSet')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.WaitingPipeline ? (
          <Badge status="warning" text={t('Waiting for Pipeline')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.Initializing ? (
          <Badge status="warning" text={t('Initializing')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.Running ? (
          <Badge status="processing" text={t('Running')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.Draining ? (
          <Badge status="processing" text={t('Draining')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.Completed ? (
          <Badge status="success" text={t('Completed')} />
        ) : record.status?.jobStatus === ExperimentJobStatus.Failed ? (
          <Badge
            status="error"
            text={
              <span>
                {t('Failed')}
                <ErrorTooltip record={record} />
              </span>
            }
          />
        ) : (
          <Badge status="default" text={record.status?.jobStatus ?? '-'} />
        ),
      filters: [
        { text: t('Scheduled'), value: ExperimentJobStatus.Scheduled },
        { text: t('Waiting for DataSet'), value: ExperimentJobStatus.WaitingDataSet },
        { text: t('Waiting for Pipeline'), value: ExperimentJobStatus.WaitingPipeline },
        { text: t('Initializing'), value: ExperimentJobStatus.Initializing },
        { text: t('Running'), value: ExperimentJobStatus.Running },
        { text: t('Draining'), value: ExperimentJobStatus.Draining },
        { text: t('Completed'), value: ExperimentJobStatus.Completed },
        { text: t('Failed'), value: ExperimentJobStatus.Failed },
      ],
      onFilter: (value, record) => record.status?.jobStatus === value,
      sorter: (a, b) =>
        allExperimentJobStatuses.indexOf(a.status?.jobStatus as ExperimentJobStatus) -
        allExperimentJobStatuses.indexOf(b.status?.jobStatus as ExperimentJobStatus),
    },
    {
      title: t('Start Time'),
      width: 200,
      render: (text, record) =>
        record.status?.startTime !== undefined ? dayjs(record.status?.startTime).format('YYYY-MM-DD HH:mm:ss') : '-',
      sorter: (a, b) =>
        (a.status?.startTime !== undefined ? dayjs(a.status?.startTime).unix() : 0) -
        (b.status?.startTime !== undefined ? dayjs(b.status?.startTime).unix() : 0),
    },
    {
      title: t('Completion Time'),
      width: 200,
      render: (text, record) =>
        record.status?.completionTime !== undefined
          ? dayjs(record.status?.completionTime).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      sorter: (a, b) =>
        (a.status?.completionTime !== undefined ? dayjs(a.status?.completionTime).unix() : 0) -
        (b.status?.completionTime !== undefined ? dayjs(b.status?.completionTime).unix() : 0),
    },
    {
      title: t('Dashboards'),
      width: 250,
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            size="small"
            icon={<FontAwesomeIcon icon={faGauge} />}
            onClick={() => {
              navigate(`/dashboard/experimentDetail/${record.metadata.namespace}/${record.metadata.name}`);
            }}
          >
            {t('Exp. Detail')}
          </Button>
          <Button
            type="text"
            size="small"
            icon={<FontAwesomeIcon icon={faGauge} />}
            onClick={() => {
              navigate(`/dashboard/loadGenerator/${record.metadata.namespace}/${record.metadata.name}`);
            }}
          >
            {t('Load Gen.')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('Experiment')}
      resourceKindUrl="experiment"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteExperimentMutation}
      columns={columns}
      scroll={{ x: 1650 }}
    />
  );
};

export default ExperimentList;
