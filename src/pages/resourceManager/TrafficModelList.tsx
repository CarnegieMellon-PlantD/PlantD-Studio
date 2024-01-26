import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteTrafficModelMutation, useListTrafficModelsQuery } from '@/services/resourceManager/trafficModelApi';
import { LoadPatternDTO } from '@/types/resourceManager/loadPattern';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const TrafficModelList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('TrafficModel'),
    listHook: useListTrafficModelsQuery,
  });

  const columns: ColumnsType<LoadPatternDTO> = [
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
      resourceKind={t('TrafficModel')}
      resourceKindUrl="trafficModel"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteTrafficModelMutation}
      columns={columns}
      scroll={{ x: 850 }}
    />
  );
};

export default TrafficModelList;
