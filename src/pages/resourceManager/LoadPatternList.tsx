import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteLoadPatternMutation, useListLoadPatternsQuery } from '@/services/resourceManager/loadPatternApi';
import { LoadPatternDTO } from '@/types/resourceManager/loadPattern';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const LoadPatternList: React.FC = () => {
  const { t } = useTranslation(['loadPatternList', 'resourceList', 'common']);
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKindPlural: t('common:loadPatternPlural'),
    listHook: useListLoadPatternsQuery,
  });

  const columns: ColumnsType<LoadPatternDTO> = [
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
      title: t('numStagesCol'),
      width: 150,
      render: (value, record) => <span>{record.spec.stages?.length ?? 0}</span>,
      sorter: (a, b) => (a.spec.stages?.length ?? 0) - (b.spec.stages?.length ?? 0),
    },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('common:loadPattern')}
      resourceKindUrl="loadPattern"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteLoadPatternMutation}
      columns={columns}
      scroll={{ x: 850 }}
    />
  );
};

export default LoadPatternList;
