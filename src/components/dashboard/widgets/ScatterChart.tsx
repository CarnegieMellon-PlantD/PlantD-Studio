import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Scatter, ScatterConfig } from '@ant-design/plots';
import { Card } from 'antd';
import dayjs from 'dayjs';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { useGetTriChannelDataQuery } from '@/services/dashboard/dataApi';
import { ScatterChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';

const ScatterChart: React.FC<ScatterChartProps> = ({ width, height, title, dataRequest, widget }) => {
  const { dataGeneration } = useContext(DashboardContext);
  const { data, refetch } = useGetTriChannelDataQuery(dataRequest);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<ScatterConfig>(
    () => ({
      data: data ?? [],
      xField: 'x',
      yField: 'y',
      colorField: 'series',
      shape: 'circle',
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
    }),
    [data, widget.xAxisType, widget.xAxisMin, widget.xAxisMax]
  );

  return (
    <Card title={title} className={getWidgetClsName(width ?? 1, height ?? 1)}>
      <Scatter {...config} />
    </Card>
  );
};

export default ScatterChart;
