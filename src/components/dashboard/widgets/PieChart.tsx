import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Pie, PieConfig } from '@ant-design/plots';
import { Badge, Card, Tooltip } from 'antd';
import { useDarkMode } from 'usehooks-ts';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { NoData } from '@/components/dashboard/widgets/NoData';
import { useGetBiChannelDataQuery } from '@/services/dashboard/dataApi';
import { PieChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const PieChart: React.FC<PieChartProps> = ({ request, display, ...props }) => {
  const { isDarkMode } = useDarkMode();
  const { dataGeneration } = useContext(DashboardContext);
  const { data, error, isSuccess, isError, isFetching, refetch } = useGetBiChannelDataQuery(request);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<PieConfig>(
    () => ({
      theme: isDarkMode ? 'dark' : 'light',
      data: data ?? [],
      colorField: 'series',
      angleField: 'y',
      radius: 0.9,
      width: display.width,
      height: display.height,
      label: {
        type: 'inner',
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      },
      legend: {
        position: 'right',
      },
      animation: false,
    }),
    [isDarkMode, data, display]
  );

  return (
    <Card
      title={props.title}
      extra={
        isFetching ? (
          <Badge status="processing" />
        ) : isSuccess ? (
          <Badge status="success" />
        ) : isError ? (
          <Tooltip title={getErrMsg(error)}>
            <Badge status="error" />
          </Tooltip>
        ) : null
      }
      size="small"
      bordered={false}
      bodyStyle={{ padding: '5px' }}
      className={getWidgetClsName(props.gridWidth ?? 1, props.gridHeight ?? 1)}
    >
      {data !== undefined && data.length > 0 ? <Pie {...config} /> : <NoData />}
    </Card>
  );
};

export default PieChart;
