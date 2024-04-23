import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { App } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useUpdateEffect } from 'usehooks-ts';

import Dashboard from '@/components/dashboard/Dashboard';
import { defaultRefreshInterval, defaultViewWindow } from '@/constants/dashboard';
import { useGetExperimentQuery } from '@/services/resourceManager/experimentApi';
import { DashboardProps } from '@/types/dashboard/dashboardProps';
import { ExperimentJobStatus } from '@/types/resourceManager/experiment';
import { byteBinUnitValueFormatter, prefixSuffixValueFormatter } from '@/utils/dashboard/gaugeChartValueFormatters';
import { getStep } from '@/utils/dashboard/getStep';
import { getErrMsg } from '@/utils/getErrMsg';

const numSamples = 600;
const realTimeRange = '1m';

const getTotalRequestQuery = (namespace: string, name: string): string => {
  return `sum by(endpoint) (k6_http_reqs_total{experiment="${namespace}/${name}"})`;
};

const getHTTPFailureQuery = (namespace: string, name: string): string => {
  return `sum by(endpoint) (k6_http_reqs_total{experiment="${namespace}/${name}", expected_response="false"})`;
};

const getPeakRPSQuery = (namespace: string, name: string): string => {
  return `avg by(endpoint) (deriv(k6_http_reqs_total{experiment="${namespace}/${name}"}[${realTimeRange}]))`;
};

const getP99ResponseTimeQuery = (namespace: string, name: string): string => {
  return `avg by(endpoint) (k6_http_req_waiting_p99{experiment="${namespace}/${name}"})`;
};

const getDataReceivedQuery = (namespace: string, name: string): string => {
  return `sum by(endpoint) (k6_data_received_total{experiment="${namespace}/${name}"})`;
};

const getDataSentQuery = (namespace: string, name: string): string => {
  return `sum by(endpoint) (k6_data_sent_total{experiment="${namespace}/${name}"})`;
};

const LoadGeneratorDashboard: React.FC = () => {
  const params = useParams();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>(() => {
    const now = dayjs();
    return [now.add(-defaultViewWindow, 'minute'), now];
  });
  const [refreshInterval, setRefreshInterval] = useState(defaultRefreshInterval);

  // Automatically set time range based on Experiment's start time
  const { data, isError, error } = useGetExperimentQuery({
    metadata: {
      namespace: params.namespace ?? '',
      name: params.name ?? '',
    },
  });
  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(t('Failed to get {kind} resource: {error}', { kind: t('Experiment'), error: getErrMsg(error) }));
    }
  }, [isError, error]);
  useEffect(() => {
    if (data !== undefined) {
      if (
        data?.status?.startTime === undefined ||
        data?.status?.completionTime === undefined ||
        (data?.status?.jobStatus !== ExperimentJobStatus.Completed &&
          data?.status?.jobStatus !== ExperimentJobStatus.Failed)
      ) {
        return;
      }
      const startTime = dayjs(data.status.startTime);
      const completionTime = dayjs(data.status.completionTime);
      // Since no end time is available, assume the duration of the Experiment to be the default value
      setTimeRange([startTime, completionTime]);
      setRefreshInterval(0);
    }
  }, [data, params.namespace, params.name]);

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: [t('Dashboard'), t('Load Generator: {target}', { target: `${params.namespace}/${params.name}` })],
      timeRange,
      setTimeRange,
      refreshInterval,
      setRefreshInterval,
      refreshButtonResetTime: 'auto-refresh-only',
      widgets: [
        {
          __type: 'gauge',
          title: t('Total Request'),
          request: {
            __source: 'prometheus',
            query: getTotalRequestQuery(params.namespace ?? '', params.name ?? ''),
            end: timeRange[1].unix(),
            labelSelector: ['endpoint'],
          },
          display: {},
        },
        {
          __type: 'gauge',
          title: t('HTTP Failure'),
          request: {
            __source: 'prometheus',
            query: getHTTPFailureQuery(params.namespace ?? '', params.name ?? ''),
            end: timeRange[1].unix(),
            labelSelector: ['endpoint'],
          },
          display: {},
        },
        {
          __type: 'gauge',
          title: t('Peak RPS'),
          request: {
            __source: 'prometheus',
            query: getPeakRPSQuery(params.namespace ?? '', params.name ?? ''),
            end: timeRange[1].unix(),
            labelSelector: ['endpoint'],
          },
          display: {
            valueFormatter: prefixSuffixValueFormatter(2, '', ''),
          },
        },
        {
          __type: 'gauge',
          title: t('P99 Response Time'),
          request: {
            __source: 'prometheus',
            query: getP99ResponseTimeQuery(params.namespace ?? '', params.name ?? ''),
            end: timeRange[1].unix(),
            labelSelector: ['endpoint'],
          },
          display: {
            valueFormatter: prefixSuffixValueFormatter(2, '', ' ms'),
          },
        },
        {
          __type: 'gauge',
          title: t('Data Received'),
          request: {
            __source: 'prometheus',
            query: getDataReceivedQuery(params.namespace ?? '', params.name ?? ''),
            end: timeRange[1].unix(),
            labelSelector: ['endpoint'],
          },
          display: {
            valueFormatter: byteBinUnitValueFormatter(2),
          },
        },
        {
          __type: 'gauge',
          title: t('Data Sent'),
          request: {
            __source: 'prometheus',
            query: getDataSentQuery(params.namespace ?? '', params.name ?? ''),
            end: timeRange[1].unix(),
            labelSelector: ['endpoint'],
          },
          display: {
            valueFormatter: byteBinUnitValueFormatter(2),
          },
        },
        {
          __type: 'line',
          title: t('Requests'),
          gridWidth: 6,
          request: {
            __source: 'prometheus',
            query: `sum by(endpoint)(irate(k6_http_reqs_total{experiment="${params.namespace}/${params.name}"}[30s]))`,
            start: timeRange[0].unix(),
            end: timeRange[1].unix(),
            step: getStep(timeRange[0].unix(), timeRange[1].unix(), numSamples),
            labelSelector: ['endpoint'],
          },
          display: {
            height: 600,
            xAxisType: 'time',
            xAxisMin: timeRange[0].unix(),
            xAxisMax: timeRange[1].unix(),
            xAxisTitle: t('Time'),
            yAxisTitle: t('Request / Second'),
          },
        },
      ],
    }),
    [t, timeRange, refreshInterval, params.namespace, params.name]
  );

  return <Dashboard {...dashboardProps} />;
};

export default LoadGeneratorDashboard;
