import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { InfoCircleOutlined } from '@ant-design/icons';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteExperimentMutation, useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import {
  allExperimentExperimentStates,
  ExperimentDTO,
  ExperimentExperimentState,
} from '@/types/resourceManager/experiment';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const ErrorTooltip: React.FC<{ record: ExperimentDTO }> = ({ record }) => {
  return (
    <>
      {' '}
      <Tooltip title={record.status.experimentState}>
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
    pollingInterval: 10000,
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
      title: t('Duration'),
      width: 150,
      render: (text, record) =>
        Object.entries(record.status.duration ?? {})
          .map(([key, value]) => `${key}: ${value}`)
          .join(', '),
    },
    {
      title: t('Dashboards'),
      width: 150,
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
    {
      title: t('Status'),
      width: 150,
      render: (text, record) =>
        record.status.experimentState === ExperimentExperimentState.Pending ? (
          <Badge status="warning" text={t('Pending')} />
        ) : record.status.experimentState === ExperimentExperimentState.Initializing ? (
          <Badge status="warning" text={t('Initializing')} />
        ) : record.status.experimentState === ExperimentExperimentState.WaitingForPipelineReady ? (
          <Badge status="warning" text={t('Waiting For Pipeline')} />
        ) : record.status.experimentState === ExperimentExperimentState.Ready ? (
          <Badge status="success" text={t('Ready')} />
        ) : record.status.experimentState === ExperimentExperimentState.Running ? (
          <Badge status="processing" text={t('Running')} />
        ) : record.status.experimentState === ExperimentExperimentState.Finished ? (
          <Badge status="success" text={t('Finished')} />
        ) : record.status.experimentState?.startsWith(ExperimentExperimentState.Error) ? (
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
          <Badge status="default" text={record.status.experimentState ?? '-'} />
        ),
      filters: [
        { text: t('Pending'), value: ExperimentExperimentState.Pending },
        { text: t('Initializing'), value: ExperimentExperimentState.Initializing },
        {
          text: t('Waiting For Pipeline'),
          value: ExperimentExperimentState.WaitingForPipelineReady,
        },
        { text: t('Ready'), value: ExperimentExperimentState.Ready },
        { text: t('Running'), value: ExperimentExperimentState.Running },
        { text: t('Finished'), value: ExperimentExperimentState.Finished },
        { text: t('Failed'), value: ExperimentExperimentState.Error },
      ],
      onFilter: (value, record) =>
        record.status.experimentState?.startsWith(value as ExperimentExperimentState) ?? false,
      sorter: (a, b) =>
        allExperimentExperimentStates.indexOf(a.status.experimentState as never) -
        allExperimentExperimentStates.indexOf(b.status.experimentState as never),
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
      scroll={{ x: 1000 }}
    />
  );
};

export default ExperimentList;
