import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Bar, BarConfig } from '@ant-design/plots';
import { Badge, Card, Tooltip } from 'antd';
import { useDarkMode } from 'usehooks-ts';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { NoData } from '@/components/dashboard/widgets/NoData';
import { useGetBiChannelDataQuery } from '@/services/dashboard/dataApi';
import { BarChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const BarChart: React.FC<BarChartProps> = ({ request, display, ...props }) => {
  const { isDarkMode } = useDarkMode();
  const { dataGeneration } = useContext(DashboardContext);
  const { data, error, isSuccess, isError, isFetching, refetch } = useGetBiChannelDataQuery(request);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<BarConfig>(
    () => ({
      theme: isDarkMode ? 'dark' : 'light',
      data: data ?? [],
      xField: 'y',
      yField: 'series',
      seriesField: 'series',
      width: display.width,
      height: display.height,
      xAxis: {
        title: {
          text: display.xAxisTitle,
        },
      },
      yAxis: {
        title: {
          text: display.yAxisTitle,
        },
      },
      legend: {
        position: 'bottom',
      },
      animation: false,
    }),
    [data]
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
      {data !== undefined && data.length > 0 ? <Bar {...config} /> : <NoData />}
    </Card>
  );
};

export default BarChart;
