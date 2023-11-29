import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { faCheckCircle, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Badge, Breadcrumb, Card, Statistic, Table } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import { useListCostExportersQuery } from '@/services/resourceManager/costExporterApi';
import { useListDataSetsQuery } from '@/services/resourceManager/dataSetApi';
import { useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import { useListLoadPatternsQuery } from '@/services/resourceManager/loadPatternApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useListPipelinesQuery } from '@/services/resourceManager/pipelineApi';
import { useGetPlantDCoreQuery } from '@/services/resourceManager/plantDCoreApi';
import { useListSchemasQuery } from '@/services/resourceManager/schemaApi';
import { getClsName } from '@/utils/getClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const plantDCoreMetadata = {
  namespace: 'plantd-operator-system',
  name: 'plantdcore-core',
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const {
    data: plantDCore,
    isError: isGetPlantDCoreError,
    error: getPlantDCoreError,
  } = useGetPlantDCoreQuery({
    metadata: plantDCoreMetadata,
  });

  useUpdateEffect(() => {
    if (isGetPlantDCoreError) {
      message.error(`Failed to get PlantDCore: ${getErrMsg(getPlantDCoreError)}`);
    }
  }, [isGetPlantDCoreError]);

  const { data: namespaces, isError: isListNamespacesError, error: listNamespacesError } = useListNamespacesQuery();

  useUpdateEffect(() => {
    if (isListNamespacesError) {
      message.error(`Failed to list Namespaces: ${getErrMsg(listNamespacesError)}`);
    }
  }, [isListNamespacesError]);

  const { data: schemas, isError: isListSchemasError, error: listSchemasError } = useListSchemasQuery();

  useUpdateEffect(() => {
    if (isListSchemasError) {
      message.error(`Failed to list Schemas: ${getErrMsg(listSchemasError)}`);
    }
  }, [isListSchemasError]);

  const { data: dataSets, isError: isListDataSetsError, error: listDataSetsError } = useListDataSetsQuery();

  useUpdateEffect(() => {
    if (isListDataSetsError) {
      message.error(`Failed to list DataSets: ${getErrMsg(listDataSetsError)}`);
    }
  }, [isListDataSetsError]);

  const {
    data: loadPatterns,
    isError: isListLoadPatternsError,
    error: listLoadPatternsError,
  } = useListLoadPatternsQuery();

  useUpdateEffect(() => {
    if (isListLoadPatternsError) {
      message.error(`Failed to list LoadPatterns: ${getErrMsg(listLoadPatternsError)}`);
    }
  }, [isListLoadPatternsError]);

  const { data: pipelines, isError: isListPipelinesError, error: listPipelinesError } = useListPipelinesQuery();

  useUpdateEffect(() => {
    if (isListPipelinesError) {
      message.error(`Failed to list Pipelines: ${getErrMsg(listPipelinesError)}`);
    }
  }, [isListPipelinesError]);

  const { data: experiments, isError: isListExperimentsError, error: listExperimentsError } = useListExperimentsQuery();

  useUpdateEffect(() => {
    if (isListExperimentsError) {
      message.error(`Failed to list Experiments: ${getErrMsg(listExperimentsError)}`);
    }
  }, [isListExperimentsError]);

  const {
    data: costExporters,
    isError: isListCostExportersError,
    error: listCostExportersError,
  } = useListCostExportersQuery();

  useUpdateEffect(() => {
    if (isListCostExportersError) {
      message.error(`Failed to list CostExporters: ${getErrMsg(listCostExportersError)}`);
    }
  }, [isListCostExportersError]);

  const isAllRunning = useMemo(
    () =>
      plantDCore?.status?.kubeProxyReady &&
      plantDCore?.status?.studioReady &&
      plantDCore?.status?.prometheusReady &&
      plantDCore?.status?.redisReady,
    [plantDCore]
  );

  return (
    <div className="p-6">
      <Breadcrumb items={[{ title: t('PlantD Studio') }, { title: t('System Overview') }]} className="mb-6" />

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card bordered={false} className="col-span-2 lg:col-span-2 xl:col-span-4">
          <div className="flex items-center gap-6">
            <FontAwesomeIcon
              icon={isAllRunning ? faCheckCircle : faCircleExclamation}
              className={getClsName(isAllRunning ? 'text-green-600' : 'text-orange-600', 'text-8xl')}
            />
            <span className="text-xl">
              {isAllRunning ? t('Everything is up and running.') : t('Some modules are not running as expected.')}
            </span>
          </div>
        </Card>
        <Card bordered={false} className="col-span-2">
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-500">PlantD Proxy:</span>
            <Badge
              status={plantDCore?.status?.kubeProxyReady ? 'success' : 'warning'}
              text={plantDCore?.status?.kubeProxyStatus ?? '-'}
            />
            <span className="text-gray-500">PlantD Studio:</span>
            <Badge
              status={plantDCore?.status?.studioReady ? 'success' : 'warning'}
              text={plantDCore?.status?.studioStatus ?? '-'}
            />
            <span className="text-gray-500">Prometheus:</span>
            <Badge
              status={plantDCore?.status?.prometheusReady ? 'success' : 'warning'}
              text={plantDCore?.status?.prometheusStatus ?? '-'}
            />
            <span className="text-gray-500">Redis:</span>
            <Badge
              status={plantDCore?.status?.redisReady ? 'success' : 'warning'}
              text={plantDCore?.status?.redisStatus ?? '-'}
            />
          </div>
        </Card>
        <Card bordered={false}>
          <Statistic title={t('Namespace')} value={namespaces?.length ?? '-'} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('Schema')} value={schemas?.length ?? '-'} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('DataSet')} value={dataSets?.length ?? '-'} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('LoadPattern')} value={loadPatterns?.length ?? '-'} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('Pipeline')} value={pipelines?.length ?? '-'} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('Experiment')} value={experiments?.length ?? '-'} />
        </Card>
        <Card bordered={false}>
          <Statistic title={t('CostExporter')} value={costExporters?.length ?? '-'} />
        </Card>
        <Card title={t('CostExporter Statistics')} className="col-span-2 lg:col-span-4 xl:col-span-6">
          <Table
            dataSource={costExporters}
            columns={[
              {
                key: 'name',
                title: t('Name'),
                render: (_, record) => record.metadata.name ?? '-',
              },
              {
                key: 'namespace',
                title: t('Namespace'),
                render: (_, record) => record.metadata.namespace ?? '-',
              },
              {
                key: 'lastExecutionTime',
                title: t('Last Execution Time'),
                render: (_, record) => record.status?.jobCompletionTime ?? '-',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;
