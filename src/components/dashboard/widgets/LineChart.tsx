import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Line, LineConfig } from '@ant-design/plots';
import { Badge, Card, Spin, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useDarkMode } from 'usehooks-ts';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { NoData } from '@/components/dashboard/widgets/NoData';
import { longDateTimeFormat, shortDateTimeFormat } from '@/constants/dashboard';
import { useGetRedisRawDataQuery, useGetTriChannelDataQuery } from '@/services/dashboard/dataApi';
import { RedisRawDataRequest } from '@/types/dashboard/dataRequests';
import { LineChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const LineChart: React.FC<LineChartProps> = ({ request, display, ...props }) => {
  const { isDarkMode } = useDarkMode();
  const { dataGeneration } = useContext(DashboardContext);
  const redisDataResult = useGetRedisRawDataQuery(request);
  const triChannelDataResult = useGetTriChannelDataQuery(request);
  let xFieldValue: string = 'x';
  let yFieldValue: string = 'y';
  let data: unknown, error, isSuccess, isError, isFetching, refetch: () => void;

  if ((request as RedisRawDataRequest).__source === 'redis') {
    ({ data, error, isSuccess, isError, isFetching, refetch } = redisDataResult);
    xFieldValue = 'date';
    yFieldValue = display.yField!;
  } else {
    ({ data, error, isSuccess, isError, isFetching, refetch } = triChannelDataResult);
  }
  useEffect(() => {
    refetch();
  }, [dataGeneration, refetch]);

  const config = useMemo<LineConfig>(
    () => ({
      theme: isDarkMode ? 'dark' : 'light',
      data: Array.isArray(data) ? data : [],
      xField: xFieldValue,
      yField: yFieldValue,
      seriesField: 'series',
      width: display.width,
      height: display.height,
      meta: {
        x: {
          type: 'linear',
          formatter:
            display.xAxisType === 'time' ? (value) => dayjs.unix(value).format(shortDateTimeFormat) : undefined,
        },
      },
      xAxis: {
        min: display.xAxisMin,
        max: display.xAxisMax,
        title: {
          text: display.xAxisTitle ?? '',
        },
        grid: {
          line: {
            style: {
              stroke: '#a8a8a8',
            },
          },
        },
      },
      yAxis: {
        min: display.yAxisMin,
        max: display.yAxisMax,
        title: {
          text: display.yAxisTitle ?? '',
        },
        grid: {
          line: {
            style: {
              stroke: '#a8a8a8',
            },
          },
        },
      },
      tooltip: {
        title: (t, d) => (display.xAxisType === 'time' ? dayjs.unix(d.x).format(longDateTimeFormat) : t),
      },
      legend: {
        position: 'bottom',
      },
      animation: false,
      connectNulls: false,
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
        ) : isError && error ? (
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
      {isFetching ? <Spin tip="Loading..." /> : data !== undefined ? <Line {...config} /> : <NoData />}
    </Card>
  );
};
export default LineChart;
