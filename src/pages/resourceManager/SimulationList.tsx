import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import ErrorTooltip from '@/components/resourceManager/ErrorTooltip';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteSimulationMutation, useListSimulationsQuery } from '@/services/resourceManager/simulationApi';
import {
  allSimulationSimulationJobStatus,
  SimulationDTO,
  SimulationJobStatus,
} from '@/types/resourceManager/simulation';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const SimulationsList: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Simulations'),
    listHook: useListSimulationsQuery,
    pollingInterval: autoRefreshInterval,
  });

  const columns: ColumnsType<SimulationDTO> = [
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
      title: t('Status'),
      width: 200,
      render: (text, record) =>
        record.status?.jobStatus === SimulationJobStatus.Running ? (
          <Badge status="processing" text={t('Running')} />
        ) : record.status?.jobStatus === SimulationJobStatus.Completed ? (
          <Badge status="success" text={t('Completed')} />
        ) : record.status?.jobStatus === SimulationJobStatus.Failed ? (
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
        { text: 'Running', value: SimulationJobStatus.Running },
        { text: 'Completed', value: SimulationJobStatus.Completed },
        { text: 'Failed', value: SimulationJobStatus.Failed },
      ],
      onFilter: (value, record) => record.status?.jobStatus === value,
      sorter: (a, b) =>
        allSimulationSimulationJobStatus.indexOf(a.status?.jobStatus as SimulationJobStatus) -
        allSimulationSimulationJobStatus.indexOf(b.status?.jobStatus as SimulationJobStatus),
    },
    {
      title: t('Reports'),
      width: 150,
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            size="small"
            icon={<FontAwesomeIcon icon={faGauge} />}
            onClick={() => {
              navigate(`/report/simulationReport/${record.metadata.namespace}/${record.metadata.name}`);
            }}
            disabled={record.status?.jobStatus !== SimulationJobStatus.Completed}
          >
            {t('Sim. Report')}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <BaseResourceList
      caption={t(
        "Simulations are the result of running a Traffic model (representing a projection of what data a business will receive in some year) on a digital twin (a mathematical representation of a pipeline's behavior and cost) to produce projections of a pipeline's performance and cost over a year.  Run simulations with different pipelines under the same conditions to inform a business choice about two candidate pipelines, or simulate the same pipeline with different traffic models to understand how sensitive the cost and performance predictions are to differing guesses about your business' needs."
      )}
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('Simulation')}
      resourceKindUrl="simulation"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteSimulationMutation}
      columns={columns}
      scroll={{ x: 1050 }}
    />
  );
};

export default SimulationsList;
