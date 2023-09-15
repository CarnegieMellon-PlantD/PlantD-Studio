import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Card, Statistic } from 'antd';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { useGetBiChannelDataQuery } from '@/services/dashboard/dataApi';
import { GaugeChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';

const getFriendlyByte = (value: number, precision: number) => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let idx = 0;
  while (value > 1024) {
    value /= 1024;
    idx++;
  }
  return `${value.toFixed(precision)} ${units[idx]}`;
};

const GaugeChart: React.FC<GaugeChartProps> = ({ width, height, title, dataRequest, widget }) => {
  const { dataGeneration } = useContext(DashboardContext);
  const { data, refetch } = useGetBiChannelDataQuery(dataRequest);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  return (
    <Card title={title} className={getWidgetClsName(width ?? 1, height ?? 1)}>
      <div className="flex gap-4 flex-wrap">
        {data !== undefined &&
          data.map(({ y, series }, index) => (
            <Statistic
              key={index}
              title={series}
              value={y ?? '-'}
              formatter={(value) =>
                typeof value === 'string'
                  ? value
                  : widget.type === 'percent'
                  ? `${(value * 100).toFixed(widget.precision ?? 0)}%`
                  : widget.type === 'byte'
                  ? getFriendlyByte(value, widget.precision ?? 0)
                  : value.toFixed(widget.precision)
              }
            />
          ))}
      </div>
    </Card>
  );
};

export default GaugeChart;
