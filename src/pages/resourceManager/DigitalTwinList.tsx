import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import ErrorTooltip from '@/components/resourceManager/ErrorTooltip';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeleteDigitalTwinMutation, useListDigitalTwinsQuery } from '@/services/resourceManager/digitalTwinApi';
import { allDigitalTwinJobStatuses, DigitalTwinDTO, DigitalTwinJobStatus } from '@/types/resourceManager/digitalTwin';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const DigitalTwinList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('DigitalTwin'),
    listHook: useListDigitalTwinsQuery,
    pollingInterval: autoRefreshInterval,
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
    {
      title: t('Status'),
      width: 200,
      render: (text, record) =>
        record.status?.jobStatus === DigitalTwinJobStatus.Running ? (
          <Badge status="processing" text={t('Running')} />
        ) : record.status?.jobStatus === DigitalTwinJobStatus.Completed ? (
          <Badge status="success" text={t('Completed')} />
        ) : record.status?.jobStatus === DigitalTwinJobStatus.Failed ? (
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
        { text: 'Running', value: DigitalTwinJobStatus.Running },
        { text: 'Completed', value: DigitalTwinJobStatus.Completed },
        { text: 'Failed', value: DigitalTwinJobStatus.Failed },
      ],
      onFilter: (value, record) => record.status?.jobStatus === value,
      sorter: (a, b) =>
        allDigitalTwinJobStatuses.indexOf(a.status?.jobStatus as DigitalTwinJobStatus) -
        allDigitalTwinJobStatuses.indexOf(b.status?.jobStatus as DigitalTwinJobStatus),
    },
  ];

  return (
    <BaseResourceList
      caption={t(
        'Digital Twins are mathematical models that attempt to mimic your data pipeline.  When fed data from a traffic model, they will calculate approximate pipeline performance and cost without actually running your data pipeline.'
      )}
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('DigitalTwin')}
      resourceKindUrl="digitalTwin"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeleteDigitalTwinMutation}
      columns={columns}
      scroll={{ x: 900 }}
    />
  );
};

export default DigitalTwinList;
