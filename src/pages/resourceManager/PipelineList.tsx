import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'antd';
import { ColumnsType } from 'antd/es/table';

import BaseResourceList from '@/components/resourceManager/BaseResourceList';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useDeletePipelineMutation, useListPipelinesQuery } from '@/services/resourceManager/pipelineApi';
import {
  allPipelinePipelineStates,
  allPipelineStatusChecks,
  PipelineDTO,
  PipelinePipelineState,
  PipelineStatusCheck,
} from '@/types/resourceManager/pipeline';
import { sortNamespace } from '@/utils/resourceManager/sortNamespace';

const PipelineList: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch } = useResourceList({
    resourceKind: t('Pipeline'),
    listHook: useListPipelinesQuery,
    pollingInterval: 10000,
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
      title: t('Status'),
      width: 150,
      render: (text, record) =>
        record.status.pipelineState == PipelinePipelineState.Initializing ? (
          <Badge status="warning" text={t('Initializing')} />
        ) : record.status.pipelineState == PipelinePipelineState.Available ? (
          <Badge status="success" text={t('Available')} />
        ) : record.status.pipelineState == PipelinePipelineState.Engaged ? (
          <Badge status="processing" text={t('Engaged')} />
        ) : (
          <Badge status="default" text={record.status.pipelineState ?? '-'} />
        ),
      filters: [
        { text: t('Initializing'), value: PipelinePipelineState.Initializing },
        { text: t('Available'), value: PipelinePipelineState.Available },
        { text: t('Engaged'), value: PipelinePipelineState.Engaged },
      ],
      onFilter: (value, record) => record.status.pipelineState === value,
      sorter: (a, b) =>
        allPipelinePipelineStates.indexOf(a.status.pipelineState as never) -
        allPipelinePipelineStates.indexOf(b.status.pipelineState as never),
    },
    {
      title: t('Health Check'),
      width: 150,
      render: (text, record) =>
        record.status.statusCheck === PipelineStatusCheck.OK ? (
          <Badge status="success" text={t('Succeeded')} />
        ) : record.status.statusCheck === PipelineStatusCheck.Failed ? (
          <Badge status="error" text={t('Failed')} />
        ) : (
          <Badge status="default" text={record.status.statusCheck ?? '-'} />
        ),
      filters: [
        { text: t('Succeeded'), value: PipelineStatusCheck.OK },
        { text: t('Failed'), value: PipelineStatusCheck.Failed },
      ],
      onFilter: (value, record) => record.status.statusCheck === value,
      sorter: (a, b) =>
        allPipelineStatusChecks.indexOf(a.status.statusCheck as never) -
        allPipelineStatusChecks.indexOf(b.status.statusCheck as never),
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
      scroll={{ x: 1000 }}
    />
  );
};

export default PipelineList;
