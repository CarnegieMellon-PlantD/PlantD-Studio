import { BiChannelDataRequest, TriChannelDataRequest } from './dataRequests';

interface BaseWidgetProps {
  width?: 1 | 2 | 3 | 4 | 5 | 6;
  height?: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
}

export interface LineChartProps extends BaseWidgetProps {
  dataRequest: TriChannelDataRequest;
  widget: {
    xAxisType?: 'default' | 'time';
    xAxisMin?: number;
    xAxisMax?: number;
  };
}

export interface ScatterChartProps extends BaseWidgetProps {
  dataRequest: TriChannelDataRequest;
  widget: {
    xAxisType?: 'default' | 'time';
    xAxisMin?: number;
    xAxisMax?: number;
  };
}

export interface GaugeChartProps extends BaseWidgetProps {
  dataRequest: BiChannelDataRequest;
  widget: {
    type?: 'default' | 'percent' | 'byte';
    precision?: number;
  };
}

export interface PieChartProps extends BaseWidgetProps {
  dataRequest: BiChannelDataRequest;
}
