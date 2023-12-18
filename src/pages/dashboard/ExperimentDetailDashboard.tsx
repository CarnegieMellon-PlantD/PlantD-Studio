import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { App } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useUpdateEffect } from 'usehooks-ts';

import Dashboard from '@/components/dashboard/Dashboard';
import { defaultExperimentDuration, defaultRefreshInterval } from '@/constants/dashboard';
import { useGetExperimentQuery } from '@/services/resourceManager/experimentApi';
import { DashboardProps } from '@/types/dashboard/dashboardProps';
import { ExperimentExperimentState } from '@/types/resourceManager/experiment';
import { percentValueFormatter, prefixSuffixValueFormatter } from '@/utils/dashboard/gaugeChartValueFormatters';
import { getStep } from '@/utils/dashboard/getStep';
import { getErrMsg } from '@/utils/getErrMsg';

const numSamples = 400;
const realTimeRange = '30s';

const getRealTimeSuccessRateQuery = (namespace: string, name: string): string => {
  return `100 * (sum by(span_name) (irate(calls_total{namespace="${namespace}",job="${name}",status_code="STATUS_CODE_UNSET"}[${realTimeRange}])))/(sum by(span_name) (irate(calls_total{namespace="${namespace}",job="${name}"}[${realTimeRange}])))`;
};

const getAvgSuccessRateQuery = (namespace: string, name: string, startTime: number, endTime: number): string => {
  const range = `${endTime - startTime}s`;
  return `(sum by(span_name) (rate(calls_total{namespace="${namespace}",job="${name}",status_code="STATUS_CODE_UNSET"}[${range}])))/(sum by(span_name) (rate(calls_total{namespace="${namespace}",job="${name}"}[${range}])))`;
};

const getRealTimeThroughput = (namespace: string, name: string): string => {
  return `sum by(span_name) (irate(calls_total{status_code="STATUS_CODE_UNSET", job="${name}", namespace="${namespace}"}[${realTimeRange}]))`;
};

const getAvgThroughput = (namespace: string, name: string, startTime: number, endTime: number): string => {
  const range = `${endTime - startTime}s`;
  return `sum by(span_name) (rate(calls_total{status_code="STATUS_CODE_UNSET", job="${name}", namespace="${namespace}"}[${range}]))`;
};

const getRealTimeLatency = (namespace: string, name: string): string => {
  return `sum by(span_name) (irate(duration_milliseconds_sum{status_code="STATUS_CODE_UNSET", job="${name}", namespace="${namespace}"}[${realTimeRange}])) / sum by(span_name)(irate(duration_milliseconds_count{status_code="STATUS_CODE_UNSET", job="${name}", namespace="${namespace}"}[${realTimeRange}]))`;
};

const getAvgLatency = (namespace: string, name: string, startTime: number, endTime: number): string => {
  const range = `${endTime - startTime}s`;
  return `sum by(span_name) (rate(duration_milliseconds_sum{status_code="STATUS_CODE_UNSET", job="${name}", namespace="${namespace}"}[${range}])) / sum by(span_name)(rate(duration_milliseconds_count{status_code="STATUS_CODE_UNSET", job="${name}", namespace="${namespace}"}[${range}]))`;
};

const getCostFilters = (namespace: string, name: string): string[] => {
  return [`experiment=${namespace}/${name}`];
};

const ExperimentDetailDashboard: React.FC = () => {
  const params = useParams();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>(() => {
    const now = dayjs();
    return [now.add(-defaultExperimentDuration, 'minute'), now];
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
        (data?.status?.experimentState !== ExperimentExperimentState.Finished &&
          data?.status?.experimentState !== ExperimentExperimentState.Error)
      ) {
        return;
      }
      const startTime = dayjs(data.status.startTime);
      // Since no end time is available, assume the duration of the Experiment to be the default value
      setTimeRange([startTime, startTime.add(defaultExperimentDuration, 'minute')]);
      setRefreshInterval(0);
    }
  }, [data, params.namespace, params.name]);

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: [
        t('Dashboard'),
        t('Experiment Details: {target}', { target: `${params.namespace}/${params.name}` }),
      ],
      timeRange,
      setTimeRange,
      refreshInterval,
      setRefreshInterval,
      refreshButtonResetTime: 'auto-refresh-only',
      widgets: [
        {
          __type: 'line',
          title: t('Realtime Success Rate'),
          gridWidth: 4,
          request: {
            __source: 'prometheus',
            query: getRealTimeSuccessRateQuery(params.namespace ?? '', params.name ?? ''),
            start: timeRange[0].unix(),
            end: timeRange[1].unix(),
            step: getStep(timeRange[0].unix(), timeRange[1].unix(), numSamples),
            labelSelector: ['span_name'],
          },
          display: {
            height: 250,
            xAxisType: 'time',
            xAxisMin: timeRange[0].unix(),
            xAxisMax: timeRange[1].unix(),
            xAxisTitle: t('Time'),
            yAxisMin: 0,
            yAxisMax: 100,
            yAxisTitle: t('Success Rate (%)'),
          },
        },
        {
          __type: 'gauge',
          title: t('Average Success Rate'),
          gridWidth: 2,
          request: {
            __source: 'prometheus',
            query: getAvgSuccessRateQuery(
              params.namespace ?? '',
              params.name ?? '',
              timeRange[0].unix(),
              timeRange[1].unix()
            ),
            end: timeRange[1].unix(),
            labelSelector: ['span_name'],
          },
          display: {
            valueFormatter: percentValueFormatter(2),
          },
        },
        {
          __type: 'line',
          title: t('Realtime Throughput'),
          gridWidth: 4,
          request: {
            __source: 'prometheus',
            query: getRealTimeThroughput(params.namespace ?? '', params.name ?? ''),
            start: timeRange[0].unix(),
            end: timeRange[1].unix(),
            step: getStep(timeRange[0].unix(), timeRange[1].unix(), numSamples),
            labelSelector: ['span_name'],
          },
          display: {
            height: 250,
            xAxisType: 'time',
            xAxisMin: timeRange[0].unix(),
            xAxisMax: timeRange[1].unix(),
            xAxisTitle: t('Time'),
            yAxisTitle: t('Request / Second'),
          },
        },
        {
          __type: 'gauge',
          title: t('Average Throughput'),
          gridWidth: 2,
          request: {
            __source: 'prometheus',
            query: getAvgThroughput(
              params.namespace ?? '',
              params.name ?? '',
              timeRange[0].unix(),
              timeRange[1].unix()
            ),
            end: timeRange[1].unix(),
            labelSelector: ['span_name'],
          },
          display: {
            valueFormatter: prefixSuffixValueFormatter(2, '', ' RPS'),
          },
        },
        {
          __type: 'line',
          title: t('Realtime Latency'),
          gridWidth: 4,
          request: {
            __source: 'prometheus',
            query: getRealTimeLatency(params.namespace ?? '', params.name ?? ''),
            start: timeRange[0].unix(),
            end: timeRange[1].unix(),
            step: getStep(timeRange[0].unix(), timeRange[1].unix(), numSamples),
            labelSelector: ['span_name'],
          },
          display: {
            height: 250,
            xAxisType: 'time',
            xAxisMin: timeRange[0].unix(),
            xAxisMax: timeRange[1].unix(),
            xAxisTitle: t('Time'),
            yAxisTitle: t('Latency (ms)'),
          },
        },
        {
          __type: 'gauge',
          title: t('Average Latency'),
          gridWidth: 2,
          request: {
            __source: 'prometheus',
            query: getAvgLatency(params.namespace ?? '', params.name ?? '', timeRange[0].unix(), timeRange[1].unix()),
            end: timeRange[1].unix(),
            labelSelector: ['span_name'],
          },
          display: {
            valueFormatter: prefixSuffixValueFormatter(2, '', ' ms'),
          },
        },
        {
          __type: 'bar',
          title: t('Cost'),
          gridWidth: 4,
          request: {
            __source: 'redis-ts',
            filters: getCostFilters(params.namespace ?? '', params.name ?? ''),
            labelSelector: ['resource'],
          },
          display: {
            height: 400,
            xAxisTitle: t('Cost ($)'),
          },
        },
        {
          __type: 'gauge',
          title: t('Cost'),
          gridWidth: 2,
          request: {
            __source: 'redis-ts',
            filters: getCostFilters(params.namespace ?? '', params.name ?? ''),
            labelSelector: ['resource'],
          },
          display: {
            height: 400,
            valueFormatter: prefixSuffixValueFormatter(4, '$', ''),
          },
        },
      ],
    }),
    [t, timeRange, refreshInterval, params.namespace, params.name]
  );

  return <Dashboard {...dashboardProps} />;
};

export default ExperimentDetailDashboard;
