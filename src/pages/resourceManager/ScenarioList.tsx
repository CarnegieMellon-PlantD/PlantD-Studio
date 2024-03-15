import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteScenarioMutation, useListScenariosQuery } from '@/services/resourceManager/scenarioApi';
import { ScenarioDTO } from '@/types/resourceManager/scenario';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const ScenarioList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Scenario'),
    listHook: useListScenariosQuery,
    pollingInterval: autoRefreshInterval,
  });

  const columns: ColumnsType<ScenarioDTO> = [
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
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('Scenario')}
      resourceKindUrl="scenario"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteScenarioMutation}
      columns={columns}
      scroll={{ x: 1000 }}
    />
  );
};

export default ScenarioList;
