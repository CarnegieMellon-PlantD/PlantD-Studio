import * as React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';

import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardProps } from '@/types/dashboard/dashboardProps';

const LoadGeneratorDashboard: React.FC = () => {
  const params = useParams();
  const { t } = useTranslation();

  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>(() => {
    const now = dayjs();
    return [now.add(-2, 'hour'), now];
  });

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: [t('Dashboard'), `Load Generator Dashboard: ${params.namespace}/${params.name}`],
      timeRange,
      setTimeRange,
      defaultRefreshInterval: 2,
      widgets: [
        {
          type: 'gauge',
          props: {
            title: 'Request Made',
            width: 1,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(endpoint)(k6_http_reqs_total{experiment="${params.namespace}/${params.name}"})`,
                end: timeRange[1].unix(),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              type: 'default',
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'HTTP Failures',
            width: 1,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(endpoint)(k6_http_reqs_total{experiment="${params.namespace}/${params.name}", expected_response="false"})`,
                end: timeRange[1].unix(),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              type: 'default',
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'Peak RPS',
            width: 1,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(endpoint)(deriv(k6_http_reqs_total{experiment="${params.namespace}/${params.name}"}[1m]))`,
                end: timeRange[1].unix(),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              type: 'default',
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'P99 Response Time',
            width: 1,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `k6_http_req_waiting_p99{experiment="${params.namespace}/${params.name}"}`,
                end: timeRange[1].unix(),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              type: 'default',
              precision: 5,
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'Data Received',
            width: 1,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `k6_data_received_total{experiment="${params.namespace}/${params.name}"}`,
                end: timeRange[1].unix(),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              type: 'byte',
              precision: 2,
            },
          },
        },
        {
          type: 'gauge',
          props: {
            title: 'Data Sent',
            width: 1,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `k6_data_sent_total{experiment="${params.namespace}/${params.name}"}`,
                end: timeRange[1].unix(),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              type: 'byte',
              precision: 2,
            },
          },
        },
        {
          type: 'line',
          props: {
            title: 'Requests',
            width: 6,
            dataRequest: {
              source: 'prometheus',
              params: {
                query: `sum by(endpoint)(irate(k6_http_reqs_total{experiment="${params.namespace}/${params.name}"}[30s]))`,
                start: timeRange[0].unix(),
                end: timeRange[1].unix(),
                step: Math.floor((timeRange[1].unix() - timeRange[0].unix()) / 1000),
                labelSelector: ['endpoint'],
              },
            },
            widget: {
              xAxisType: 'time',
              xAxisMin: timeRange[0].unix(),
              xAxisMax: timeRange[1].unix(),
            },
          },
        },
      ],
    }),
    [timeRange, params.namespace, params.name]
  );

  return <Dashboard {...dashboardProps} />;
};

export default LoadGeneratorDashboard;
