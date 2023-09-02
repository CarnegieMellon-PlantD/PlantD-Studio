import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { defaultNamespace } from '@/constants/base';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteNamespaceMutation, useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { NamespaceDTO } from '@/types/resourceManager/namespace';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const NamespaceList: React.FC = () => {
  const { t } = useTranslation(['resourceList', 'common']);
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKindPlural: t('common:namespacePlural'),
    listHook: useListNamespacesQuery,
  });

  const columns: ColumnsType<NamespaceDTO> = [
    {
      title: t('nameCol'),
      dataIndex: ['metadata', 'name'],
      sorter: (a, b) => sortNamespace(a.metadata.name, b.metadata.name),
      defaultSortOrder: 'ascend',
    },
  ];

  return (
    <BaseResourceList
      allowDelete={(record) => record.metadata.name !== defaultNamespace}
      resourceKind={t('common:namespace')}
      resourceKindUrl="namespace"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteNamespaceMutation}
      columns={columns}
      scroll={{ x: 500 }}
    />
  );
};

export default NamespaceList;
