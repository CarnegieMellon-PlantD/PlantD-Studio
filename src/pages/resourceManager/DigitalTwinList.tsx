import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteDigitalTwinMutation, useListDigitalTwinsQuery } from '@/services/resourceManager/digitalTwinApi';
import { DigitalTwinDTO } from '@/types/resourceManager/digitalTwin';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const DigitalTwinList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('DigitalTwin'),
    listHook: useListDigitalTwinsQuery,
  });

  const columns: ColumnsType<DigitalTwinDTO> = [
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
      resourceKind={t('DigitalTwin')}
      resourceKindUrl="DigitalTwin"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteDigitalTwinMutation}
      columns={columns}
      scroll={{ x: 850 }}
      caption={t(
        'Digital Twins are mathematical models that attempt to mimic your data pipeline.  When fed data from a traffic model, they will calculate approximate pipeline performance and cost without actually running your data pipeline.'
      )}
    />
  );
};

export default DigitalTwinList;
