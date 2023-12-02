import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Breadcrumb, Button, DatePicker, Select } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';

import DashboardContext from '@/components/dashboard/DashboardContext';
import AreaChart from '@/components/dashboard/widgets/AreaChart';
import BarChart from '@/components/dashboard/widgets/BarChart';
import GaugeChart from '@/components/dashboard/widgets/GaugeChart';
import LineChart from '@/components/dashboard/widgets/LineChart';
import PieChart from '@/components/dashboard/widgets/PieChart';
import ScatterChart from '@/components/dashboard/widgets/ScatterChart';
import { DashboardProps } from '@/types/dashboard/dashboardProps';

const Dashboard: React.FC<DashboardProps> = ({
  breadcrumbs = [],
  timeRange,
  setTimeRange,
  defaultTimeRange,
  showTimeRangeEdit = true,
  enableTimeRangeEdit = true,
  refreshInterval,
  setRefreshInterval,
  defaultRefreshInterval,
  showRefreshIntervalEdit = true,
  enableRefreshIntervalEdit = true,
  showRefreshButton = true,
  enableRefreshButton = true,
  refreshButtonResetTime = 'never',
  widgets,
}) => {
  const { t } = useTranslation();

  const [dataGeneration, setDataGeneration] = useState(0);
  const refetchData = useCallback(() => {
    setDataGeneration((prev) => (prev + 1) % Number.MAX_SAFE_INTEGER);
  }, []);

  // Create internal states
  const [internalTimeRange, setInternalTimeRange] = useState<[Dayjs, Dayjs]>(() => {
    if (defaultTimeRange !== undefined) {
      return defaultTimeRange;
    }
    const now = dayjs();
    return [now.add(-1, 'hour'), now];
  });
  const [internalRefreshInterval, setInternalRefreshInterval] = useState(defaultRefreshInterval ?? 0);
  // Use external states if both states and state setters are provided, otherwise use internal states
  const mergedTimeRange = useMemo(
    () => (timeRange !== undefined && setTimeRange !== undefined ? timeRange : internalTimeRange),
    [timeRange, setTimeRange, internalTimeRange]
  );
  const mergedSetTimeRange = useMemo(
    () => (timeRange !== undefined && setTimeRange !== undefined ? setTimeRange : setInternalTimeRange),
    [timeRange, setTimeRange, setInternalTimeRange]
  );
  const mergedRefreshInterval =
    refreshInterval !== undefined && setRefreshInterval !== undefined ? refreshInterval : internalRefreshInterval;
  const mergedSetRefreshInterval =
    refreshInterval !== undefined && setRefreshInterval !== undefined ? setRefreshInterval : setInternalRefreshInterval;

  useEffect(() => {
    if (mergedRefreshInterval === 0) {
      // The previous timer is already cleared when its lifecycle ends
      // Do not create a new timer or return its destructor
      return;
    }

    // Create a new timer and return its destructor
    const id = window.setInterval(() => {
      // Move the time range forward to align the end time with the current time, while keeping the duration unchanged
      mergedSetTimeRange(([prevStart, prevEnd]) => {
        const now = dayjs();
        return [dayjs(now.valueOf() - prevEnd.valueOf() + prevStart.valueOf()), now];
      });
      refetchData();
    }, mergedRefreshInterval * 1000);
    return () => {
      window.clearInterval(id);
    };
  }, [mergedRefreshInterval]);

  const timeRangePresets = useMemo<RangePickerProps['presets']>(
    () => [
      ...[1, 2, 5, 10, 15, 20, 30, 45].map((value) => ({
        label: t('Last {value, plural, one {# minute} other {# minutes}}', { value }),
        value: (): [Dayjs, Dayjs] => {
          const now = dayjs();
          return [now.add(-value, 'minute'), now];
        },
      })),
      ...[1, 2, 3, 4, 6, 12, 18].map((value) => ({
        label: t('Last {value, plural, one {# hour} other {# hours}}', { value }),
        value: (): [Dayjs, Dayjs] => {
          const now = dayjs();
          return [now.add(-value, 'hour'), now];
        },
      })),
      ...[1, 2, 4, 7, 14].map((value) => ({
        label: t('Last {value, plural, one {# day} other {# days}}', { value }),
        value: (): [Dayjs, Dayjs] => {
          const now = dayjs();
          return [now.add(-value, 'day'), now];
        },
      })),
    ],
    []
  );

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ title: t('PlantD Studio') }, ...breadcrumbs.map((title) => ({ title }))]}
        className="mb-6"
      />
      {(showTimeRangeEdit || showRefreshIntervalEdit || showRefreshButton) && (
        <div className="mb-6 flex justify-end gap-4">
          {showTimeRangeEdit && (
            <DatePicker.RangePicker
              showTime
              allowClear={false}
              disabled={!enableTimeRangeEdit}
              presets={timeRangePresets}
              value={[mergedTimeRange[0], mergedTimeRange[1]]}
              onChange={(value) => {
                if (value === null || value[0] === null || value[1] === null) {
                  return;
                }
                mergedSetTimeRange([value[0], value[1]]);
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
              value={mergedRefreshInterval}
              onChange={(value) => mergedSetRefreshInterval(value)}
            />
          )}
          {showRefreshButton && (
            <Button
              icon={<FontAwesomeIcon icon={faRefresh} />}
              disabled={!enableRefreshButton}
              onClick={() => {
                if (
                  refreshButtonResetTime === 'always' ||
                  (refreshButtonResetTime === 'auto-refresh-only' && mergedRefreshInterval !== 0)
                ) {
                  // Move the time range forward to align the end time with the current time, while keeping the duration unchanged
                  mergedSetTimeRange(([prevStart, prevEnd]) => {
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
          {widgets.map((widget, index) =>
            widget.__type === 'gauge' ? (
              <GaugeChart key={index} {...widget} />
            ) : widget.__type === 'pie' ? (
              <PieChart key={index} {...widget} />
            ) : widget.__type === 'bar' ? (
              <BarChart key={index} {...widget} />
            ) : widget.__type === 'line' ? (
              <LineChart key={index} {...widget} />
            ) : widget.__type === 'area' ? (
              <AreaChart key={index} {...widget} />
            ) : widget.__type === 'scatter' ? (
              <ScatterChart key={index} {...widget} />
            ) : null
          )}
        </div>
      </DashboardContext.Provider>
    </div>
  );
};

export default Dashboard;
