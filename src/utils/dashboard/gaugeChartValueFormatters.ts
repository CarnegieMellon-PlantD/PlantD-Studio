import * as React from 'react';

type GaugeChartValueFormatter = (value: string | number) => React.ReactNode | undefined;

export const prefixSuffixValueFormatter = (
  precision: number,
  prefix: string,
  suffix: string
): GaugeChartValueFormatter => {
  return (value) => {
    if (typeof value === 'string') {
      return `${prefix}${value}${suffix}`;
    }
    return `${prefix}${value.toFixed(precision)}${suffix}`;
  };
};

export const percentValueFormatter = (precision: number): GaugeChartValueFormatter => {
  return (value) => {
    if (typeof value === 'string') {
      return value;
    }
    return `${(100 * value).toFixed(precision)}%`;
  };
};

export const byteSIUnitValueFormatter = (precision: number): GaugeChartValueFormatter => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'];
  const base = 1000;
  return (value) => {
    if (typeof value === 'string') {
      return value;
    }
    let idx = 0;
    while (value >= base) {
      value /= base;
      idx++;
    }
    return `${value.toFixed(precision)} ${units[idx]}`;
  };
};

export const byteBinUnitValueFormatter = (precision: number): GaugeChartValueFormatter => {
  const units = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const base = 1024;
  return (value) => {
    if (typeof value === 'string') {
      return value;
    }
    let idx = 0;
    while (value >= base) {
      value /= base;
      idx++;
    }
    return `${value.toFixed(precision)} ${units[idx]}`;
  };
};
