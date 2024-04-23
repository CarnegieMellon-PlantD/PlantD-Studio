import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteNetCostMutation, useListNetCostsQuery } from '@/services/resourceManager/netCostApi';
import { NetCostDTO } from '@/types/resourceManager/netCost';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const NetCostList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('NetCost'),
    listHook: useListNetCostsQuery,
  });

  const columns: ColumnsType<NetCostDTO> = [
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
      resourceKind={t('NetCost')}
      resourceKindUrl="netCost"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteNetCostMutation}
      columns={columns}
      scroll={{ x: 700 }}
    />
  );
};

export default NetCostList;
