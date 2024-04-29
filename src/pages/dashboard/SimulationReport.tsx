import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Area, AreaConfig } from '@ant-design/plots';
import { Breadcrumb, Card } from 'antd';
import csvtojson from 'csvtojson';
import { useDarkMode } from 'usehooks-ts';

import { NoData } from '@/components/dashboard/widgets/NoData';
import { useGetRedisRawDataQuery } from '@/services/dashboard/dataApi';
import { getWidgetClsName } from '@/utils/dashboard/getWidgetClsName';

const SimulationReportLineChart: React.FC<{
  title: string;
  data: Record<string, unknown>[];
  xField: string;
  yField: string;
}> = ({ title, data, xField, yField }) => {
  const { isDarkMode } = useDarkMode();

  const config = useMemo<AreaConfig>(
    () => ({
      theme: isDarkMode ? 'dark' : 'light',
      data: data,
      xField,
      yField,
      height: 250,
      meta: {
        x: {
          type: 'linear',
        },
      },
      yAxis: {
        tickCount: 5,
        grid: {
          line: {
            style: {
              stroke: '#a8a8a8',
            },
          },
        },
      },
      legend: {
        position: 'bottom',
      },
      animation: false,
      connectNulls: false,
    }),
    [isDarkMode, data]
  );

  return (
    <Card title={title} size="small" bordered={false} bodyStyle={{ padding: '5px' }} className={getWidgetClsName(3, 1)}>
      {data !== undefined ? <Area {...config} /> : <NoData />}
    </Card>
  );
};

const SimulationReport: React.FC = () => {
  const params = useParams();
  const { t } = useTranslation();

  const { data, isSuccess } = useGetRedisRawDataQuery(`plantd:simulation_monthly:${params.namespace}.${params.name}`);

  const [parsedData, setParsedData] = useState<Record<string, unknown>[]>([]);
  const [processedData, setProcessedData] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    if (isSuccess && data !== undefined) {
      csvtojson()
        .fromString(data)
        .then((json) => setParsedData(json));
    }
  }, [isSuccess, data]);
  useEffect(() => {
    setProcessedData(
      parsedData.map((item) => ({
        ...item,
      }))
    );
  }, [parsedData]);

  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { title: t('PlantD Studio') },
          { title: t('Resources') },
          { title: t('Simulation') },
          { title: t('Dashboard') },
          { title: `Simulation Report: ${params.namespace}/${params.name}` },
        ]}
        className="mb-6"
      />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        <SimulationReportLineChart
          title="Records Processed Per Month"
          data={processedData}
          xField="Month"
          yField="hourly"
        />
        <SimulationReportLineChart
          title="Total Latency: How long records take to process"
          data={processedData}
          xField="Month"
          yField="latency_fifo"
        />
        <SimulationReportLineChart
          title="Queue Length: How many records are waiting to be processed"
          data={processedData}
          xField="Month"
          yField="queue_len"
        />
        <SimulationReportLineChart
          title="Total count of records processed per month for product schema"
          data={processedData}
          xField="Month"
          yField="task_product_rph"
        />
        <SimulationReportLineChart
          title="Total count of records processed per month for supplier schema"
          data={processedData}
          xField="Month"
          yField="task_supplier_rph"
        />
        <SimulationReportLineChart
          title="Total count of records processed per month for warehouse schema"
          data={processedData}
          xField="Month"
          yField="task_warehouse_rph"
        />
        <SimulationReportLineChart title="Total MB processed" data={processedData} xField="Month" yField="bandwidth" />
        <SimulationReportLineChart
          title="Network cost"
          data={processedData}
          xField="Month"
          yField="hourly_network_cost"
        />
        <SimulationReportLineChart
          title="Data storage costs"
          data={processedData}
          xField="Month"
          yField="hourly_raw_data_store_cost"
        />
        <SimulationReportLineChart
          title="Pipeline infrastructure cost"
          data={processedData}
          xField="Month"
          yField="pipeline_cost"
        />
      </div>
    </div>
  );
};

export default SimulationReport;
