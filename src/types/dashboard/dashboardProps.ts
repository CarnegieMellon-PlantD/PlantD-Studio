import * as React from 'react';
import { Dayjs } from 'dayjs';

import { GaugeChartProps, LineChartProps, PieChartProps, ScatterChartProps } from '@/types/dashboard/widgetProps';

type WidgetManifest =
  | { type: 'line'; props: LineChartProps }
  | { type: 'scatter'; props: ScatterChartProps }
  | { type: 'gauge'; props: GaugeChartProps }
  | { type: 'pie'; props: PieChartProps };

export interface DashboardProps {
  breadcrumbs?: React.ReactNode[];
  timeRange: [Dayjs, Dayjs];
  setTimeRange: React.Dispatch<React.SetStateAction<[Dayjs, Dayjs]>>;
  showTimeRangeEdit?: boolean;
  enableTimeRangeEdit?: boolean;
  defaultRefreshInterval?: number;
  showRefreshIntervalEdit?: boolean;
  enableRefreshIntervalEdit?: boolean;
  showRefreshButton?: boolean;
  enableRefreshButton?: boolean;
  refreshButtonResetTime?: 'always' | 'never';
  widgets: WidgetManifest[];
}
