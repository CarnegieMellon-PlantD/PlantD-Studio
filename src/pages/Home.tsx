import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { faCheckCircle, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Badge, Breadcrumb, Card, Statistic, Table } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import { plantDCoreName, plantDCoreNamespace } from '@/constants/resourceManager';
import { useGetI18nKind } from '@/hooks/resourceManager/useGetI18nKind';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useListCostExportersQuery } from '@/services/resourceManager/costExporterApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useGetPlantDCoreQuery } from '@/services/resourceManager/plantDCoreApi';
import { useListKindsQuery, useListResourcesQuery } from '@/services/resourceManager/utilApi';
import { concatInPath } from '@/utils/concatInPath';
import { getClsName } from '@/utils/getClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const getI18nKind = useGetI18nKind();

  const {
    data: plantDCore,
    isSuccess: isGetPlantDCoreSuccess,
    isError: isGetPlantDCoreError,
    error: getPlantDCoreError,
  } = useGetPlantDCoreQuery({
    metadata: {
      namespace: plantDCoreNamespace,
      name: plantDCoreName,
    },
  });
  const { data: namespaces, isSuccess: isListNamespacesSuccess } = useResourceList({
    resourceKind: t('Namespace'),
    listHook: useListNamespacesQuery,
  });
  const { data: costExporters, isSuccess: isListCostExportersSuccess } = useResourceList({
    resourceKind: t('CostExporter'),
    listHook: useListCostExportersQuery,
  });
  const { data: kinds, isError: isListKindsError, error: listKindsError } = useListKindsQuery();
  const { data: resources, isError: isListResourcesError, error: listResourcesError } = useListResourcesQuery();

  useUpdateEffect(() => {
    if (isGetPlantDCoreError && getPlantDCoreError !== undefined) {
      message.error(
        t('Failed to get {kind} resource: {error}', {
          kind: t('PlantDCore'),
          error: getErrMsg(getPlantDCoreError),
        })
      );
    }
  }, [isGetPlantDCoreError]);

  useUpdateEffect(() => {
    if (isListKindsError && listKindsError !== undefined) {
      message.error(t('Failed to list kinds: {error}', { error: getErrMsg(listKindsError) }));
    }
  }, [isListKindsError, listKindsError]);

  useUpdateEffect(() => {
    if (isListResourcesError && listResourcesError !== undefined) {
      message.error(t('Failed to list resources: {error}', { error: getErrMsg(listResourcesError) }));
    }
  }, [isListResourcesError, listResourcesError]);

  const isAllRunning = useMemo(
    () =>
      plantDCore?.status?.proxyStatus?.numReady == plantDCore?.status?.proxyStatus?.numDesired &&
      plantDCore?.status?.studioStatus?.numReady == plantDCore?.status?.studioStatus?.numDesired &&
      plantDCore?.status?.prometheusStatus?.numReady == plantDCore?.status?.prometheusStatus?.numDesired &&
      plantDCore?.status?.thanosStoreStatus?.numReady == plantDCore?.status?.thanosStoreStatus?.numDesired &&
      plantDCore?.status?.thanosCompactorStatus?.numReady == plantDCore?.status?.thanosCompactorStatus?.numDesired &&
      plantDCore?.status?.thanosQuerierStatus?.numReady == plantDCore?.status?.thanosQuerierStatus?.numDesired &&
      plantDCore?.status?.redisStatus?.numReady == plantDCore?.status?.redisStatus?.numDesired &&
      plantDCore?.status?.opencostStatus?.numReady == plantDCore?.status?.opencostStatus?.numDesired,
    [plantDCore]
  );

  return (
    <div className="p-6">
      <Breadcrumb items={[{ title: t('PlantD Studio') }, { title: t('System Overview') }]} className="mb-6" />

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card bordered={false} className="col-span-2 lg:col-span-2 xl:col-span-4" loading={!isGetPlantDCoreSuccess}>
          <div className="flex items-center gap-6">
            <FontAwesomeIcon
              icon={isAllRunning ? faCheckCircle : faCircleExclamation}
              className={getClsName(isAllRunning ? 'text-green-600' : 'text-yellow-600', 'text-8xl')}
            />
            <span className="text-xl font-medium">
              {isAllRunning ? t('Everything is up and running.') : t('Some modules are not running as expected.')}
            </span>
          </div>
        </Card>
        <Card bordered={false} className="col-span-2" loading={!isGetPlantDCoreSuccess}>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-500">{t('PlantD Proxy:')}</span>
            <Badge
              status={
                plantDCore?.status?.proxyStatus?.numReady === plantDCore?.status?.proxyStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.proxyStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('PlantD Studio:')}</span>
            <Badge
              status={
                plantDCore?.status?.studioStatus?.numReady === plantDCore?.status?.studioStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.studioStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Prometheus:')}</span>
            <Badge
              status={
                plantDCore?.status?.prometheusStatus?.numReady === plantDCore?.status?.prometheusStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.prometheusStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Thanos Store:')}</span>
            <Badge
              status={
                plantDCore?.status?.thanosStoreStatus?.numReady === plantDCore?.status?.thanosStoreStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.thanosStoreStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Thanos Compactor:')}</span>
            <Badge
              status={
                plantDCore?.status?.thanosCompactorStatus?.numReady ===
                plantDCore?.status?.thanosCompactorStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.thanosCompactorStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Thanos Querier:')}</span>
            <Badge
              status={
                plantDCore?.status?.thanosQuerierStatus?.numReady ===
                plantDCore?.status?.thanosQuerierStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.thanosQuerierStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Redis:')}</span>
            <Badge
              status={
                plantDCore?.status?.redisStatus?.numReady === plantDCore?.status?.redisStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.redisStatus?.text ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('OpenCost:')}</span>
            <Badge
              status={
                plantDCore?.status?.opencostStatus?.numReady === plantDCore?.status?.opencostStatus?.numDesired
                  ? 'success'
                  : 'warning'
              }
              text={plantDCore?.status?.opencostStatus?.text ?? t('Unknown')}
            />
          </div>
        </Card>
        <Card bordered={false} loading={!isListNamespacesSuccess}>
          <Statistic title={'Namespace'} value={namespaces?.length ?? '-'} />
        </Card>
        {kinds?.map((kind, kindIdx) => (
          <Card key={kindIdx} bordered={false}>
            <Statistic title={getI18nKind(kind)} value={resources?.filter((res) => res.kind === kind).length ?? '-'} />
          </Card>
        ))}
        <Card
          title={t('CostExporter Statistics')}
          bordered={false}
          loading={!isListCostExportersSuccess}
          className="col-span-2 lg:col-span-4 xl:col-span-6"
        >
          <Table
            dataSource={costExporters}
            rowKey={(record) => concatInPath(record.metadata.namespace, record.metadata.name)}
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
                key: 'lastSuccess',
                title: t('Last Successful Run'),
                render: (_, record) => record.status?.lastSuccess ?? '-',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;
