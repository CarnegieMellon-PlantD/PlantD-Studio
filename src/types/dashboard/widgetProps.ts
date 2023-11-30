import * as React from 'react';

import { BiChannelDataRequest, TriChannelDataRequest } from '@/types/dashboard/dataRequests';

type BaseWidgetProps = {
  gridWidth?: 1 | 2 | 3 | 4 | 5 | 6;
  gridHeight?: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
};

export interface GaugeChartProps extends BaseWidgetProps {
  request: BiChannelDataRequest;
  display: {
    height?: number;
    titleFormatter?: (title: string) => React.ReactNode | undefined;
    valueFormatter?: (value: string | number) => React.ReactNode;
    valueStyle?: (value: number | null) => React.CSSProperties;
  };
}

export interface PieChartProps extends BaseWidgetProps {
  request: BiChannelDataRequest;
  display: {
    width?: number;
    height?: number;
  };
}

export interface BarChartProps extends BaseWidgetProps {
  request: BiChannelDataRequest;
  display: {
    width?: number;
    height?: number;
    xAxisTitle?: string;
    yAxisTitle?: string;
  };
}

export interface LineChartProps extends BaseWidgetProps {
  request: TriChannelDataRequest;
  display: {
    width?: number;
    height?: number;
    xAxisType?: 'default' | 'time';
    xAxisMin?: number;
    xAxisMax?: number;
    xAxisTitle?: string;
    yAxisMin?: number;
    yAxisMax?: number;
    yAxisTitle?: string;
  };
}

export interface AreaChartProps extends BaseWidgetProps {
  request: TriChannelDataRequest;
  display: {
    width?: number;
    height?: number;
    xAxisType?: 'default' | 'time';
    xAxisMin?: number;
    xAxisMax?: number;
    xAxisTitle?: string;
    yAxisMin?: number;
    yAxisMax?: number;
    yAxisTitle?: string;
  };
}

export interface ScatterChartProps extends BaseWidgetProps {
  request: TriChannelDataRequest;
  display: {
    width?: number;
    height?: number;
    xAxisType?: 'default' | 'time';
    xAxisMin?: number;
    xAxisMax?: number;
    xAxisTitle?: string;
    yAxisMin?: number;
    yAxisMax?: number;
    yAxisTitle?: string;
  };
}
