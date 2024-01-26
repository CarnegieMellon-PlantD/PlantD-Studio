import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { Line, LineConfig } from '@ant-design/plots';
import { Badge, Card, Tooltip } from 'antd';
import { Spin } from 'antd'; // Import Spin component from antd
import dayjs from 'dayjs';
import { useDarkMode } from 'usehooks-ts';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { NoData } from '@/components/dashboard/widgets/NoData';
import { shortDateTimeFormat } from '@/constants/dashboard';
import { useGetRedisRawDataQuery } from '@/services/dashboard/dataApi';
import { LineChartRedisProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const LineChartRedis: React.FC<LineChartRedisProps> = ({ request, display, yField, ...props }) => {
  const { isDarkMode } = useDarkMode();
  const { dataGeneration } = useContext(DashboardContext);
  const { data, error, isSuccess, isError, isFetching, refetch } = useGetRedisRawDataQuery(request);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<LineConfig>(
    () => ({
      theme: isDarkMode ? 'dark' : 'light',
      data: Array.isArray(data) ? data : [],
      xField: 'date',
      yField: yField,

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
        type: 'time',
        min: display.xAxisMin ? new Date(display.xAxisMin * 1000) : undefined,
        max: display.xAxisMax ? new Date(display.xAxisMax * 1000) : undefined,
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
        title: (t) => t,
      },
      legend: {
        position: 'bottom',
      },
      animation: false,
      connectNulls: true,
    }),
    [isDarkMode, data, display, display.xAxisMax, display.xAxisMin]
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
      {isFetching ? <Spin tip="Loading..." /> : data !== undefined ? <Line {...config} /> : <NoData />}
    </Card>
  );
};

export default LineChartRedis;
