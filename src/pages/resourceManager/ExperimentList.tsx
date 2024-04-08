import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { InfoCircleOutlined } from '@ant-design/icons';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteExperimentMutation, useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import { allExperimentJobStatuses, ExperimentDTO, ExperimentJobStatus } from '@/types/resourceManager/experiment';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';
import dayjs from 'dayjs';

export const ErrorTooltip: React.FC<{ record: ExperimentDTO }> = ({ record }) => {
  return (
    <>
      {' '}
      <Tooltip title={record.status?.error}>
        <InfoCircleOutlined className="cursor-pointer" />
      </Tooltip>
    </>
  );
};

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
        Object.entries(record.status?.durations ?? {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(', '),
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
      render: (text, record) => record.status?.startTime ? dayjs(record.status?.startTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: t('Completion Time'),
      width: 200,
      render: (text, record) => record.status?.completionTime ? dayjs(record.status?.completionTime).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: t('Dashboards'),
      width: 400,
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
            {t('Experiment Detail')}
          </Button>
          <Button
            type="text"
            size="small"
            icon={<FontAwesomeIcon icon={faGauge} />}
            onClick={() => {
              navigate(`/dashboard/loadGenerator/${record.metadata.namespace}/${record.metadata.name}`);
            }}
          >
            {t('Load Generator')}
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
      scroll={{ x: 1800 }}
    />
  );
};

export default ExperimentList;
