import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteSchemaMutation, useListSchemasQuery } from '@/services/resourceManager/schemaApi';
import { SchemaDTO } from '@/types/resourceManager/schema';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const SchemaList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Schema'),
    listHook: useListSchemasQuery,
  });

  const columns: ColumnsType<SchemaDTO> = [
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
      title: t('Columns'),
      width: 150,
      render: (text, record) => <span>{record.spec.columns?.length ?? 0}</span>,
      sorter: (a, b) => (a.spec.columns?.length ?? 0) - (b.spec.columns?.length ?? 0),
    },
  ];

  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('Schema')}
      resourceKindUrl="schema"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteSchemaMutation}
      columns={columns}
      scroll={{ x: 850 }}
    />
  );
};

export default SchemaList;
