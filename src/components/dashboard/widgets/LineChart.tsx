import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Line, LineConfig } from '@ant-design/plots';
import { Card } from 'antd';
import dayjs from 'dayjs';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { useGetTriChannelDataQuery } from '@/services/dashboard/dataApi';
import { LineChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';

const LineChart: React.FC<LineChartProps> = ({ width, height, title, dataRequest, widget }) => {
  const { dataGeneration } = useContext(DashboardContext);
  const { data, refetch } = useGetTriChannelDataQuery(dataRequest);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<LineConfig>(
    () => ({
      data: data ?? [],
      xField: 'x',
      yField: 'y',
      seriesField: 'series',
      padding: 'auto',
      meta: {
        x: {
          type: 'linear',
          formatter:
            widget.xAxisType === 'time' ? (value) => dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss') : undefined,
        },
      },
      xAxis: {
        min: widget.xAxisMin,
        max: widget.xAxisMax,
      },
      legend: {
        position: 'top',
      },
      animation: false,
      connectNulls: false,
    }),
    [data, widget.xAxisType, widget.xAxisMin, widget.xAxisMax]
  );

  return (
    <Card title={title} className={getWidgetClsName(width ?? 1, height ?? 1)}>
      <Line {...config} />
    </Card>
  );
};

export default LineChart;
