import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Button, DatePicker, Select } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';

import DashboardContext from '@/components/dashboard/DashboardContext';
import GaugeChart from '@/components/dashboard/widgets/GaugeChart';
import LineChart from '@/components/dashboard/widgets/LineChart';
import PieChart from '@/components/dashboard/widgets/PieChart';
import ScatterChart from '@/components/dashboard/widgets/ScatterChart';
import { appName } from '@/constants/base';
import { DashboardProps } from '@/types/dashboard/dashboardProps';

const Dashboard: React.FC<DashboardProps> = ({
  breadcrumbs = [],
  timeRange,
  setTimeRange,
  showTimeRangeEdit = true,
  enableTimeRangeEdit = true,
  defaultRefreshInterval = 0,
  showRefreshIntervalEdit = true,
  enableRefreshIntervalEdit = true,
  showRefreshButton = true,
  enableRefreshButton = true,
  refreshButtonResetTime = 'never',
  widgets,
}) => {
  const [dataGeneration, setDataGeneration] = useState(0);
  const refetchData = useCallback(() => {
    setDataGeneration((prev) => (prev + 1) % Number.MAX_SAFE_INTEGER);
  }, []);

  const [refreshInterval, setRefreshInterval] = useState(defaultRefreshInterval);

  useEffect(() => {
    if (refreshInterval === 0) {
      // The previous timer is already cleared when its lifecycle ends
      // Do not create a new timer or return its destructor
      return;
    }

    // Create a new timer and return its destructor
    const id = window.setInterval(() => {
      setTimeRange(([prevStart, prevEnd]) => {
        const now = dayjs();
        return [dayjs(now.valueOf() - prevEnd.valueOf() + prevStart.valueOf()), now];
      });
      refetchData();
    }, refreshInterval * 1000);
    return () => {
      window.clearInterval(id);
    };
  }, [refreshInterval]);

  const timeRangePresets = useMemo<RangePickerProps['presets']>(
    () => [
      ...[1, 5, 15, 30, 45].map((value) => ({
        label: value <= 1 ? `Last ${value} minute` : `Last ${value} minutes`,
        value: (): [Dayjs, Dayjs] => {
          const now = dayjs();
          return [now.add(-value, 'minute'), now];
        },
      })),
      ...[1, 2, 4, 6, 12, 24, 48, 72].map((value) => ({
        label: value <= 1 ? `Last ${value} hour` : `Last ${value} hours`,
        value: (): [Dayjs, Dayjs] => {
          const now = dayjs();
          return [now.add(-value, 'hour'), now];
        },
      })),
    ],
    []
  );

  return (
    <div className="p-6">
      <Breadcrumb items={[{ title: appName }, ...breadcrumbs.map((title) => ({ title }))]} className="mb-6" />
      {(showTimeRangeEdit || showRefreshIntervalEdit || showRefreshButton) && (
        <div className="mb-6 flex justify-end gap-4">
          {showTimeRangeEdit && (
            <DatePicker.RangePicker
              showTime
              allowClear={false}
              disabled={!enableTimeRangeEdit}
              presets={timeRangePresets}
              value={[timeRange[0], timeRange[1]]}
              onChange={(value) => {
                if (value === null || value[0] === null || value[1] === null) {
                  return;
                }
                setTimeRange([value[0], value[1]]);
                refetchData();
              }}
            />
          )}
          {showRefreshIntervalEdit && (
            <Select
              className="w-32"
              disabled={!enableRefreshIntervalEdit}
              options={[
                { value: 0, label: 'Disabled' },
                { value: 2, label: '2 Seconds' },
                { value: 5, label: '5 Seconds' },
                { value: 10, label: '10 Seconds' },
              ]}
              value={refreshInterval}
              onChange={(value) => setRefreshInterval(value)}
            />
          )}
          {showRefreshButton && (
            <Button
              icon={<FontAwesomeIcon icon={faRefresh} />}
              disabled={!enableRefreshButton}
              onClick={() => {
                if (refreshButtonResetTime === 'always') {
                  setTimeRange(([prevStart, prevEnd]) => {
                    const now = dayjs();
                    return [dayjs(now.valueOf() - prevEnd.valueOf() + prevStart.valueOf()), now];
                  });
                }
                refetchData();
              }}
            />
          )}
        </div>
      )}
      <DashboardContext.Provider value={{ dataGeneration }}>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-6">
          {widgets.map(({ type, props }, index) =>
            type === 'line' ? (
              <LineChart key={index} {...props} />
            ) : type === 'scatter' ? (
              <ScatterChart key={index} {...props} />
            ) : type === 'gauge' ? (
              <GaugeChart key={index} {...props} />
            ) : type === 'pie' ? (
              <PieChart key={index} {...props} />
            ) : null
          )}
        </div>
      </DashboardContext.Provider>
    </div>
  );
};

export default Dashboard;
