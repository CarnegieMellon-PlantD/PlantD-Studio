import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
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

  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>(() => {
    const now = dayjs();
    return [now.add(-1, 'hour'), now];
  });

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: ['Dashboard', `Experiment Detail Dashboard: ${params.namespace}/${params.name}`],
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
                query: `100 * rate(calls{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s]) / rate(calls{job="${params.name}", namespace="${params.namespace}"}[30s])`,
                start: timeRange[0].unix(),
                end: timeRange[1].unix(),
                step: Math.floor((timeRange[1].unix() - timeRange[0].unix()) / 500),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              xAxisType: 'time',
              xAxisMin: timeRange[0].unix(),
              xAxisMax: timeRange[1].unix(),
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
                query: `rate(calls{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[1h]) / rate(calls{job="${params.name}", namespace="${params.namespace}"}[1h])`,
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
                query: `rate(calls{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s])`,
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
                query: `rate(calls{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[1h])`,
                end: timeRange[1].unix(),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              precision: 2,
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
                query: `rate(duration_sum{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s]) / rate(duration_count{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[30s])`,
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
                query: `rate(duration_sum{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[1h]) / rate(duration_count{status_code="STATUS_CODE_UNSET", job="${params.name}", namespace="${params.namespace}"}[1h])`,
                end: timeRange[1].unix(),
                labelSelector: ['span_name'],
              },
            },
            widget: {
              precision: 2,
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
