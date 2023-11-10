import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { App } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useUpdateEffect } from 'usehooks-ts';

import Dashboard from '@/components/dashboard/Dashboard';
import { useListExperimentsQuery } from '@/services/resourceManager/experimentApi';
import { DashboardProps } from '@/types/dashboard/dashboardProps';
import { getErrMsg } from '@/utils/getErrMsg';

const ExperimentDetailDashboard: React.FC = () => {
  const params = useParams();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>(() => {
    const now = dayjs();
    return [now.add(-1, 'hour'), now];
  });

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: [t('Dashboard'), `Experiment Detail Dashboard: ${params.namespace}/${params.name}`],
      timeRange,
      setTimeRange,
      showRefreshIntervalEdit: false,
      widgets: [
        {
          type: 'line',
          props: {
            title: 'Realtime Success Rate',
            width: 4,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `100 * (sum by(span_name) (irate(calls_total{namespace="${params.namespace}",job="${params.name}",status_code="STATUS_CODE_UNSET"}[30s])))/(sum by(span_name) (irate(calls_total{namespace="${params.namespace}",job="${params.name}"}[30s])))`,
                start: timeRange[0].unix(),
                end: timeRange[1].unix(),
                step: Math.floor((timeRange[1].unix() - timeRange[0].unix()) / 400),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              xAxisType: 'time',
              xAxisMin: timeRange[0].unix(),
              xAxisMax: timeRange[1].unix(),
              xAxisTitle: 'Time',
              yAxisTitle: 'Success Rate (%)',
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'Average Success Rate',
            width: 2,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `(sum by(span_name) (rate(calls_total{namespace="${params.namespace}",job="${
                  params.name
                }",status_code="STATUS_CODE_UNSET"}[${
                  timeRange[1].unix() - timeRange[0].unix()
                }s])))/(sum by(span_name) (rate(calls_total{namespace="${params.namespace}",job="${params.name}"}[${
                  timeRange[1].unix() - timeRange[0].unix()
                }s])))`,
                end: timeRange[1].unix(),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              type: 'percent',
              precision: 2,
            },
          },
        },
        {
          type: 'line',
          props: {
            title: 'Realtime Throughput',
            width: 4,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(span_name)(irate(calls_total{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s]))`,
                start: timeRange[0].unix(),
                end: timeRange[1].unix(),
                step: Math.floor((timeRange[1].unix() - timeRange[0].unix()) / 400),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              xAxisType: 'time',
              xAxisMin: timeRange[0].unix(),
              xAxisMax: timeRange[1].unix(),
              xAxisTitle: 'Time',
              yAxisTitle: 'Request / Second',
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'Average Throughput',
            width: 2,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(span_name)(rate(calls_total{status_code="STATUS_CODE_UNSET", job="${
                  params.name
                }", namespace="${params.namespace}"}[${timeRange[1].unix() - timeRange[0].unix()}s]))`,
                end: timeRange[1].unix(),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              precision: 2,
              suffix: ' RPS',
            },
          },
        },
        {
          type: 'line',
          props: {
            title: 'Realtime Latency',
            width: 4,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(span_name)(irate(duration_milliseconds_sum{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s])) / sum by(span_name)(irate(duration_milliseconds_count{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s]))`,
                start: timeRange[0].unix(),
                end: timeRange[1].unix(),
                step: Math.floor((timeRange[1].unix() - timeRange[0].unix()) / 200),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              xAxisType: 'time',
              xAxisMin: timeRange[0].unix(),
              xAxisMax: timeRange[1].unix(),
              xAxisTitle: 'Time',
              yAxisTitle: 'Latency (ms)',
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'Average Latency',
            width: 2,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(span_name)(rate(duration_milliseconds_sum{status_code="STATUS_CODE_UNSET", job="${
                  params.name
                }", namespace="${params.namespace}"}[${
                  timeRange[1].unix() - timeRange[0].unix()
                }s])) / sum by(span_name)(rate(duration_milliseconds_count{status_code="STATUS_CODE_UNSET", job="${
                  params.name
                }", namespace="${params.namespace}"}[${timeRange[1].unix() - timeRange[0].unix()}s]))`,
                end: timeRange[1].unix(),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              precision: 2,
              suffix: ' ms',
            },
          },
        },
      ],
    }),
    [timeRange, params.namespace, params.name]
  );

  // Automatically set time range based on Experiment's start time
  const { data, isError, error } = useListExperimentsQuery();

  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(`Failed to get Experiment information: ${getErrMsg(error)}`);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data !== undefined) {
      const experiment = data.find(
        (experiment) => experiment.metadata.namespace === params.namespace && experiment.metadata.name === params.name
      );
      if (experiment?.status.startTime === undefined) {
        return;
      }
      const startTime = dayjs(experiment.status.startTime);
      // Since no end time is available, assume the duration of the Experiment to be 2 hour
      setTimeRange([startTime, startTime.add(2, 'hour')]);
    }
  }, [data, params.namespace, params.name]);

  return <Dashboard {...dashboardProps} />;
};

export default ExperimentDetailDashboard;
