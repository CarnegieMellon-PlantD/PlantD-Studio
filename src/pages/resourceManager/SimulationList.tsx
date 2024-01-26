import * as React from 'react';

import { useDeleteSimulationMutation, useListSimulationsQuery } from '@/services/resourceManager/simulationApi';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SimulationDTO } from '@/types/resourceManager/simulation';
import { faGauge } from '@fortawesome/free-solid-svg-icons';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';
import { useNavigate } from 'react-router';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useTranslation } from 'react-i18next';

const SimulationsList: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Simulations'),
    listHook: useListSimulationsQuery,
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
      title: t('Dashboards'),
      width: 150,
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            size="small"
            icon={<FontAwesomeIcon icon={faGauge} />}
            onClick={() => {
              navigate(`/dashboard/simulationReport/${record.metadata.namespace}/${record.metadata.name}`);
            }}
          >
            {t('Simulation Report')}
          </Button>
        </div>
      ),
    },
    // {
    //   title: t('Model'),
    //   width: 200,
    //   dataIndex: ['metadata', 'model'],
    //   sorter: (a, b) => sortNamespace(a.metadata.namespace, b.metadata.namespace),
    //   defaultSortOrder: 'ascend',
    // },
    // {
    //   title: t('Total Cost'),
    //   width: 150,
    //   dataIndex: ['metadata', 'records'],
    //   render: (a) => <span>{a.metadata.records}</span>,
    //   sorter: (a, b) => (a.spec.records ?? 0) - (b.spec.records ?? 0),
    // },
    // {
    //   title: t('SLAs Met'),
    //   width: 150,
    //   dataIndex: ['metadata', 'slaCount'],
    //   render: (a) => <span>{a.metadata.slaCount}</span>,
    // },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('Simulation')}
      resourceKindUrl="Simulation"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteSimulationMutation}
      columns={columns}
      scroll={{ x: 850 }}
    />
  );
};

export default SimulationsList;
