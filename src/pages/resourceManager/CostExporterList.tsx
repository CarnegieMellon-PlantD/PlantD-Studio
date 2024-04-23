import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteCostExporterMutation, useListCostExportersQuery } from '@/services/resourceManager/costExporterApi';
import { CostExporterDTO } from '@/types/resourceManager/costExporter';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const CostExporterList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('CostExporter'),
    listHook: useListCostExportersQuery,
  });

  const columns: ColumnsType<CostExporterDTO> = [
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
      title: t('Last Successful Run'),
      width: 200,
      render: (text, record) =>
        record.status?.lastSuccess !== undefined
          ? dayjs(record.status?.lastSuccess).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      sorter: (a, b) =>
        (a.status?.lastSuccess !== undefined ? dayjs(a.status?.lastSuccess).unix() : 0) -
        (b.status?.lastSuccess !== undefined ? dayjs(b.status?.lastSuccess).unix() : 0),
    },
    {
      title: t('Last Failed Run'),
      width: 200,
      render: (text, record) =>
        record.status?.lastFailure !== undefined
          ? dayjs(record.status?.lastFailure).format('YYYY-MM-DD HH:mm:ss')
          : '-',
      sorter: (a, b) =>
        (a.status?.lastFailure !== undefined ? dayjs(a.status?.lastFailure).unix() : 0) -
        (b.status?.lastFailure !== undefined ? dayjs(b.status?.lastFailure).unix() : 0),
    },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('CostExporter')}
      resourceKindUrl="costExporter"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteCostExporterMutation}
      columns={columns}
      scroll={{ x: 1100 }}
    />
  );
};

export default CostExporterList;
