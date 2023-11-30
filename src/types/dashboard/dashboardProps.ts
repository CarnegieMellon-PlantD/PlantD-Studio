import * as React from 'react';
import { Dayjs } from 'dayjs';

import {
  AreaChartProps,
  BarChartProps,
  GaugeChartProps,
  LineChartProps,
  PieChartProps,
  ScatterChartProps,
} from '@/types/dashboard/widgetProps';

type WidgetManifest =
  | ({ __type: 'gauge' } & GaugeChartProps)
  | ({ __type: 'pie' } & PieChartProps)
  | ({ __type: 'bar' } & BarChartProps)
  | ({ __type: 'line' } & LineChartProps)
  | ({ __type: 'area' } & AreaChartProps)
  | ({ __type: 'scatter' } & ScatterChartProps);

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
