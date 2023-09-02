import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Pie, PieConfig } from '@ant-design/plots';
import { Card } from 'antd';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { useGetBiChannelDataQuery } from '@/services/dashboard/dataApi';
import { PieChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';

const PieChart: React.FC<PieChartProps> = ({ width, height, title, dataRequest }) => {
  const { dataGeneration } = useContext(DashboardContext);
  const { data, refetch } = useGetBiChannelDataQuery(dataRequest);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<PieConfig>(
    () => ({
      data: data ?? [],
      colorField: 'series',
      angleField: 'y',
      radius: 0.9,
      label: {
        type: 'inner',
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      },
      legend: {
        position: 'top',
      },
      animation: false,
    }),
    [data]
  );

  return (
    <Card title={title} className={getWidgetClsName(width ?? 1, height ?? 1)}>
      <Pie {...config} />
    </Card>
  );
};

export default PieChart;
