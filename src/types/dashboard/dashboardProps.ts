import * as React from 'react';
import { Dayjs } from 'dayjs';

import {
  AreaChartProps,
  BarChartProps,
  GaugeChartProps,
  LineChartProps,
  LineChartRedisProps,
  PieChartProps,
  ScatterChartProps,
} from '@/types/dashboard/widgetProps';

/** Type for widget configuration */
type WidgetManifest =
  | ({ __type: 'gauge' } & GaugeChartProps)
  | ({ __type: 'pie' } & PieChartProps)
  | ({ __type: 'bar' } & BarChartProps)
  | ({ __type: 'line' } & LineChartProps)
  | ({ __type: 'line_redis' } & LineChartRedisProps)
  | ({ __type: 'area' } & AreaChartProps)
  | ({ __type: 'scatter' } & ScatterChartProps);

/** Props of dashboard */
export interface DashboardProps {
  /** Breadcrumbs of page */
  breadcrumbs?: React.ReactNode[];
  /** Data type for y-axis */
  yField?: string;
  /** Time range of dashboard */
  timeRange?: [Dayjs, Dayjs];
  /** Function to set time range of dashboard */
  setTimeRange?: React.Dispatch<React.SetStateAction<[Dayjs, Dayjs]>>;
  /** Default time range of dashboard, not effective if `timeRange` and `setTimeRange` are provided */
  defaultTimeRange?: [Dayjs, Dayjs];
  /**
   * Whether to show time range edit
   * @default true
   */
  showTimeRangeEdit?: boolean;
  /**
   * Whether to enable time range edit, not effective if `showTimeRangeEdit` is `false`
   * @default true
   */
  enableTimeRangeEdit?: boolean;
  /** Time interval between auto refreshes, in seconds, disabled if `0` */
  refreshInterval?: number;
  /** Function to set time interval between auto refreshes */
  setRefreshInterval?: React.Dispatch<React.SetStateAction<number>>;
  /** Default time interval between auto refreshes, not effective if `refreshInterval` and `setRefreshInterval` are provided */
  defaultRefreshInterval?: number;
  /**
   * Whether to show refresh interval edit
   * @default true
   */
  showRefreshIntervalEdit?: boolean;
  /**
   * Whether to enable refresh interval edit, not effective if `showRefreshIntervalEdit` is `false`
   * @default true
   */
  enableRefreshIntervalEdit?: boolean;
  /**
   * Whether to show manual refresh button
   * @default true
   */
  showRefreshButton?: boolean;
  /**
   * Whether to enable manual refresh button, not effective if `showRefreshButton` is `false`
   * @default true
   */
  enableRefreshButton?: boolean;
  /**
   * Behavior of manual refresh button with respect to time range
   * - `always`: always update the time range to align its end with current time, while keeping the duration unchanged
   * - `auto-refresh-only`: when auto refresh is enabled, update the time range to align its end with current time, while keeping the duration unchanged
   * - `never`: never update the time range
   * @default 'never'
   */
  refreshButtonResetTime?: 'always' | 'auto-refresh-only' | 'never';
  /** Widgets */
  widgets: WidgetManifest[];
}
