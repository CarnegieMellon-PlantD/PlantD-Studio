import * as React from 'react';
import { useContext, useEffect } from 'react';
import { Badge, Card, Statistic, Tooltip } from 'antd';

import DashboardContext from '@/components/dashboard/DashboardContext';
import { NoData } from '@/components/dashboard/widgets/NoData';
import { useGetBiChannelDataQuery } from '@/services/dashboard/dataApi';
import { GaugeChartProps } from '@/types/dashboard/widgetProps';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';
import { getErrMsg } from '@/utils/getErrMsg';

const GaugeChart: React.FC<GaugeChartProps> = ({ request, display, ...props }) => {
  const { dataGeneration } = useContext(DashboardContext);
  const { data, error, isSuccess, isError, isFetching, refetch } = useGetBiChannelDataQuery(request);

  useEffect(() => {
    refetch();
  }, [dataGeneration]);

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
      bodyStyle={{ padding: 0 }}
      className={getWidgetClsName(props.gridWidth ?? 1, props.gridHeight ?? 1)}
    >
      {data !== undefined &&
        (data.length > 0 ? (
          <div className="overflow-x-auto px-4 py-3" style={{ height: display.height }}>
            <div className="flex items-stretch gap-4 flex-wrap">
              {data.map(({ y, series }, index) => (
                <Statistic
                  key={index}
                  className="flex-auto"
                  title={display.titleFormatter === undefined ? series : display.titleFormatter(series)}
                  value={y ?? '-'}
                  formatter={display.valueFormatter}
                  valueStyle={display.valueStyle?.(y)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Re-creating padding environment of <Card> body, because we disable it before
          <div style={{ padding: '5px' }}>
            <NoData />
          </div>
        ))}
    </Card>
  );
};

export default GaugeChart;
