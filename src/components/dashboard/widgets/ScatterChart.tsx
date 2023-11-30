import * as React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Scatter, ScatterConfig } from '@ant-design/plots';
import { Badge, Card, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useDarkMode } from 'usehooks-ts';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { longDateTimeFormat, shortDateTimeFormat } from '@/constants/dashboards';
import { useGetTriChannelDataQuery } from '@/services/dashboard/dataApi';
import { ScatterChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const ScatterChart: React.FC<ScatterChartProps> = ({ request, display, ...props }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { dataGeneration } = useContext(DashboardContext);
  const { data, error, isSuccess, isError, isFetching, refetch } = useGetTriChannelDataQuery(request);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

  const config = useMemo<ScatterConfig>(
    () => ({
      theme: isDarkMode ? 'dark' : 'light',
      data: data ?? [],
      xField: 'x',
      yField: 'y',
      colorField: 'series',
      shape: 'circle',
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
        showTitle: true,
        title: (t, d) => (display.xAxisType === 'time' ? dayjs.unix(d.x).format(longDateTimeFormat) : t),
      },
      legend: {
        position: 'bottom',
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
      bodyStyle={{ padding: '10px 5px 0 5px' }}
      className={getWidgetClsName(props.gridWidth ?? 1, props.gridHeight ?? 1)}
    >
      {data !== undefined && data.length > 0 ? (
        <Scatter {...config} />
      ) : (
        <div className="text-center text-xl text-gray-400 dark:text-gray-500 py-7">{t('NO DATA')}</div>
      )}
    </Card>
  );
};

export default ScatterChart;
