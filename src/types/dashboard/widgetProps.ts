import * as React from 'react';

import { BiChannelDataRequest, TriChannelDataRequest } from '@/types/dashboard/dataRequests';

/** Common props for all widgets */
type BaseWidgetProps = {
  /** Width to occupy in the grid layout, default to `1` */
  gridWidth?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Height to occupy in the grid layout, default to `1` */
  gridHeight?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Title of the widget */
  title: string;
};

/** Props of Gauge chart */
export interface GaugeChartProps extends BaseWidgetProps {
  /** Data request for the widget */
  request: BiChannelDataRequest;
  /** Display options for the widget */
  display: {
    /** Height of the graph, in px */
    height?: number;
    /**
     * Function to format the title
     * @param title Original title
     * @returns Formatted title
     */
    titleFormatter?: (title: string) => React.ReactNode | undefined;
    /**
     * Function to format the value
     * @param value Original value
     * @returns Formatted value
     */
    valueFormatter?: (value: string | number) => React.ReactNode;
  };
}

/** Props of Pie chart */
export interface PieChartProps extends BaseWidgetProps {
  /** Data request for the widget */
  request: BiChannelDataRequest;
  /** Display options for the widget */
  display: {
    /** Width of the graph, in px */
    width?: number;
    /** Height of the graph, in px */
    height?: number;
  };
}

/** Props of Bar chart */
export interface BarChartProps extends BaseWidgetProps {
  /** Data request for the widget */
  request: BiChannelDataRequest;
  /** Display options for the widget */
  display: {
    /** Width of the graph, in px */
    width?: number;
    /** Height of the graph, in px */
    height?: number;
    /** Title of the X-axis */
    xAxisTitle?: string;
    /** Title of the Y-axis */
    yAxisTitle?: string;
  };
}

/** Props of Line chart */
export interface LineChartProps extends BaseWidgetProps {
  /** Data request for the widget */
  request: TriChannelDataRequest;
  /** Display options for the widget */
  display: {
    /** Width of the graph, in px */
    width?: number;
    /** Height of the graph, in px */
    height?: number;
    /**
     * Type of the X-axis
     * - `default`: keep the original X-axis data
     * - `time`: convert the X-axis data to time
     */
    xAxisType?: 'default' | 'time';
    /** Minimum value of the X-axis */
    xAxisMin?: number;
    /** Maximum value of the X-axis */
    xAxisMax?: number;
    /** Title of the X-axis */
    xAxisTitle?: string;
    /** Minimum value of the Y-axis */
    yAxisMin?: number;
    /** Maximum value of the Y-axis */
    yAxisMax?: number;
    /** Title of the Y-axis */
    yAxisTitle?: string;
  };
}

/** Props of Area chart */
export interface AreaChartProps extends BaseWidgetProps {
  /** Data request for the widget */
  request: TriChannelDataRequest;
  /** Display options for the widget */
  display: {
    /** Width of the graph, in px */
    width?: number;
    /** Height of the graph, in px */
    height?: number;
    /**
     * Type of the X-axis
     * - `default`: keep the original X-axis data
     * - `time`: convert the X-axis data to time
     */
    xAxisType?: 'default' | 'time';
    /** Minimum value of the X-axis */
    xAxisMin?: number;
    /** Maximum value of the X-axis */
    xAxisMax?: number;
    /** Title of the X-axis */
    xAxisTitle?: string;
    /** Minimum value of the Y-axis */
    yAxisMin?: number;
    /** Maximum value of the Y-axis */
    yAxisMax?: number;
    /** Title of the Y-axis */
    yAxisTitle?: string;
  };
}

/** Props of Scatter chart */
export interface ScatterChartProps extends BaseWidgetProps {
  /** Data request for the widget */
  request: TriChannelDataRequest;
  /** Display options for the widget */
  display: {
    /** Width of the graph, in px */
    width?: number;
    /** Height of the graph, in px */
    height?: number;
    /**
     * Type of the X-axis
     * - `default`: keep the original X-axis data
     * - `time`: convert the X-axis data to time
     */
    xAxisType?: 'default' | 'time';
    /** Minimum value of the X-axis */
    xAxisMin?: number;
    /** Maximum value of the X-axis */
    xAxisMax?: number;
    /** Title of the X-axis */
    xAxisTitle?: string;
    /** Minimum value of the Y-axis */
    yAxisMin?: number;
    /** Maximum value of the Y-axis */
    yAxisMax?: number;
    /** Title of the Y-axis */
    yAxisTitle?: string;
  };
}
