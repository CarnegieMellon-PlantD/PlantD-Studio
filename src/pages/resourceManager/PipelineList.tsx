import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { autoRefreshInterval } from '@/constants/resourceManager';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeletePipelineMutation, useListPipelinesQuery } from '@/services/resourceManager/pipelineApi';
import { allPipelineAvailabilities, PipelineDTO, PipelineAvailability } from '@/types/resourceManager/pipeline';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const PipelineList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Pipeline'),
    listHook: useListPipelinesQuery,
    pollingInterval: autoRefreshInterval,
  });

  const columns: ColumnsType<PipelineDTO> = [
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
      title: t('Availability'),
      width: 150,
      render: (text, record) =>
        record.status?.availability == PipelineAvailability.Ready ? (
          <Badge status="success" text={t('Ready')} />
        ) : record.status?.availability == PipelineAvailability.InUse ? (
          <Badge status="processing" text={t('In-Use')} />
        ) : (
          <Badge status="default" text={record.status?.availability ?? '-'} />
        ),
      filters: [
        { text: t('Ready'), value: PipelineAvailability.Ready },
        { text: t('In-Use'), value: PipelineAvailability.InUse },
      ],
      onFilter: (value, record) => record.status?.availability === value,
      sorter: (a, b) =>
        allPipelineAvailabilities.indexOf(a.status?.availability as PipelineAvailability) -
        allPipelineAvailabilities.indexOf(b.status?.availability as PipelineAvailability),
    },
  ];
  return (
    <BaseResourceList
      showNamespaceSelect
      allowClone
      allowEdit
      resourceKind={t('Pipeline')}
      resourceKindUrl="pipeline"
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      deleteHook={useDeletePipelineMutation}
      columns={columns}
      scroll={{ x: 850 }}
    />
  );
};

export default PipelineList;
