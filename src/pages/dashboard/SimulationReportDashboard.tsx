import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardProps } from '@/types/dashboard/dashboardProps';

const SimulationReportDashboard: React.FC = () => {
  const params = useParams();
  const { t } = useTranslation();

  const dashboardProps = useMemo<DashboardProps>(
    () => ({
      breadcrumbs: [t('Dashboard'), t('Simulation Report: {target}', { target: `${params.namespace}/${params.name}` })],
      refreshInterval: 0,
      setRefreshInterval: () => {},
      refreshButtonResetTime: 'auto-refresh-only',
      widgets: [
        {
          __type: 'line',
          title: t('Throughput'),
          gridWidth: 4,
          request: {
            __source: 'redis',
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            yField: 'throughput',

            height: 400,
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
          },
        },
        {
          __type: 'line',
          title: t('Cost Per Record'),
          gridWidth: 4,
          request: {
            __source: 'redis',
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            yField: 'cost_per_rec',
            height: 400,
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
          },
        },
        {
          __type: 'line',
          title: t('Cost'),
          gridWidth: 4,
          request: {
            __source: 'redis',
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            yField: 'cost',
            height: 400,
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour'),
          },
        },
        {
          __type: 'line',
          title: t('Queue Backlog'),
          gridWidth: 4,
          request: {
            __source: 'redis',
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            yField: 'queue_len',
            height: 400,
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour)'),
          },
        },
        {
          __type: 'line',
          title: t('Latency'),
          gridWidth: 4,
          request: {
            __source: 'redis',
            key: `plantd:simulation_traffic:${params.namespace}.${params.name}`,
          },
          display: {
            yField: 'latency_fifo',
            height: 400,
            xAxisType: 'time',
            xAxisTitle: t('Date (Year, Mon, Day, Hour)'),
          },
        },
      ],
    }),
    [t, params.namespace, params.name]
  );

  return <Dashboard {...dashboardProps} />;
};

export default SimulationReportDashboard;
