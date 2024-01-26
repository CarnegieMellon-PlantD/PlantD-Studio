import * as React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Dashboard from '@/components/dashboard/Dashboard';
import { defaultRefreshInterval } from '@/constants/dashboard';
import { DashboardProps } from '@/types/dashboard/dashboardProps';

const SimulationReportDashboard: React.FC = () => {
  const params = useParams();
  const { t } = useTranslation();

  const [refreshInterval] = useState(defaultRefreshInterval);

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: [t('Dashboard'), t('Simulation Report: {target}', { target: `${params.namespace}/${params.name}` })],
      // timeRange,
      // setTimeRange,
      refreshInterval: 0,
      setRefreshInterval: () => {},
      refreshButtonResetTime: 'auto-refresh-only',
      widgets: [
        {
          __type: 'line_redis',
          title: t('Throughput'),
          // start: timeRange[0].unix(),
          // end: timeRange[1].unix(),
          yField: 'throughput',
          gridWidth: 4,
          request: {
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            height: 400,
            // xAxisMin: timeRange[0].unix(),
            // xAxisMax: timeRange[1].unix(),
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
            yAxisTitle: t(''), // replace 'Value' with the actual label for your y-axis data
          },
        },
        {
          __type: 'line_redis',
          title: t('Cost Per Record'),
          // start: timeRange[0].unix(),
          // end: timeRange[1].unix(),
          yField: 'cost_per_rec',
          gridWidth: 4,
          request: {
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            height: 400,
            // xAxisMin: timeRange[0].unix(),
            // xAxisMax: timeRange[1].unix(),
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
            yAxisTitle: t(''), // replace 'Value' with the actual label for your y-axis data
          },
        },
        {
          __type: 'line_redis',
          title: t('Cost'),
          // start: timeRange[0].unix(),
          // end: timeRange[1].unix(),
          yField: 'cost',
          gridWidth: 4,
          request: {
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            height: 400,
            // xAxisMin: timeRange[0].unix(),
            // xAxisMax: timeRange[1].unix(),
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
            yAxisTitle: t(''), // replace 'Value' with the actual label for your y-axis data
          },
        },
        {
          __type: 'line_redis',
          title: t('Queue Backlog'),
          // start: timeRange[0].unix(),
          // end: timeRange[1].unix(),
          yField: 'queue_len',
          gridWidth: 4,
          request: {
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            height: 400,
            // xAxisMin: timeRange[0].unix(),
            // xAxisMax: timeRange[1].unix(),
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
            yAxisTitle: t(''), // replace 'Value' with the actual label for your y-axis data
          },
        },
        {
          __type: 'line_redis',
          title: t('Latency'),
          // start: timeRange[0].unix(),
          // end: timeRange[1].unix(),
          yField: 'latency_fifo',
          gridWidth: 4,
          request: {
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            height: 400,
            // xAxisMin: timeRange[0].unix(),
            // xAxisMax: timeRange[1].unix(),
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
            yAxisTitle: t(''), // replace 'Value' with the actual label for your y-axis data
          },
        },
      ],
    }),
    [t, refreshInterval, params.namespace, params.name]
  );

  return <Dashboard {...dashboardProps} />;
};

export default SimulationReportDashboard;
