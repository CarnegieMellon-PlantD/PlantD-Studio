import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { faCheckCircle, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App, Badge, Breadcrumb, Card, Statistic, Table } from 'antd';
import dayjs from 'dayjs';
import { useUpdateEffect } from 'usehooks-ts';

import { autoRefreshInterval, plantDCoreName, plantDCoreNamespace } from '@/constants/resourceManager';
import { useGetI18nKind } from '@/hooks/resourceManager/useGetI18nKind';
import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { useListCostExportersQuery } from '@/services/resourceManager/costExporterApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { useGetPlantDCoreQuery } from '@/services/resourceManager/plantDCoreApi';
import { useListKindsQuery, useListResourcesQuery } from '@/services/resourceManager/utilApi';
import { ComponentStatus } from '@/types/resourceManager/plantDCore';
import { concatInPath } from '@/utils/concatInPath';
import { getClsName } from '@/utils/getClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const getBadgeStatus = (
  numReady: number | undefined,
  numDesired: number | undefined
): 'success' | 'warning' | 'error' => {
  if (numReady === undefined || numDesired === undefined || numReady === 0 || numDesired === 0) {
    return 'warning';
  }

  if (numReady !== numDesired) {
    return 'error';
  }

  return 'success';
};

const getBadgeText = (status: ComponentStatus | undefined): string | undefined => {
  if (status === undefined) {
    return undefined;
  }

  return `${status.text} ( ${status.numReady ?? '-'} / ${status.numDesired ?? '-'} )`;
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const getI18nKind = useGetI18nKind();

  const {
    data: plantDCore,
    isSuccess: isGetPlantDCoreSuccess,
    isError: isGetPlantDCoreError,
    error: getPlantDCoreError,
  } = useGetPlantDCoreQuery(
    {
      metadata: {
        namespace: plantDCoreNamespace,
        name: plantDCoreName,
      },
    },
    { pollingInterval: autoRefreshInterval }
  );
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
        <Card bordered={false} className="col-span-2 lg:col-span-4 xl:col-span-2" loading={!isGetPlantDCoreSuccess}>
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
        <Card bordered={false} className="col-span-2 lg:col-span-4 xl:col-span-4" loading={!isGetPlantDCoreSuccess}>
          <div className="grid grid-cols-4 gap-1">
            <span className="text-gray-500">{t('PlantD Proxy:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.proxyStatus?.numReady,
                plantDCore?.status?.proxyStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.proxyStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('PlantD Studio:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.studioStatus?.numReady,
                plantDCore?.status?.studioStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.studioStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Prometheus:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.prometheusStatus?.numReady,
                plantDCore?.status?.prometheusStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.prometheusStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Thanos Store:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.thanosStoreStatus?.numReady,
                plantDCore?.status?.thanosStoreStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.thanosStoreStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Thanos Compactor:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.thanosCompactorStatus?.numReady,
                plantDCore?.status?.thanosCompactorStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.thanosCompactorStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Thanos Querier:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.thanosQuerierStatus?.numReady,
                plantDCore?.status?.thanosQuerierStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.thanosQuerierStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('Redis:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.redisStatus?.numReady,
                plantDCore?.status?.redisStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.redisStatus) ?? t('Unknown')}
            />
            <span className="text-gray-500">{t('OpenCost:')}</span>
            <Badge
              status={getBadgeStatus(
                plantDCore?.status?.opencostStatus?.numReady,
                plantDCore?.status?.opencostStatus?.numDesired
              )}
              text={getBadgeText(plantDCore?.status?.opencostStatus) ?? t('Unknown')}
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
                title: t('Name'),
                render: (_, record) => record.metadata.name ?? '-',
              },
              {
                title: t('Namespace'),
                render: (_, record) => record.metadata.namespace ?? '-',
              },
              {
                title: t('Last Successful Run'),
                render: (_, record) =>
                  record.status?.lastSuccess !== undefined
                    ? dayjs(record.status?.lastSuccess).format('YYYY-MM-DD HH:mm:ss')
                    : '-',
              },
              {
                title: t('Last Failed Run'),
                render: (_, record) =>
                  record.status?.lastFailure !== undefined
                    ? dayjs(record.status?.lastFailure).format('YYYY-MM-DD HH:mm:ss')
                    : '-',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default Home;
