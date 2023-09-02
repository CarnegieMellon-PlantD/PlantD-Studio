import * as React from 'react';
import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';

const DateTimePicker: React.FC<
  Omit<DatePickerProps, 'value' | 'onChange'> & {
    value?: string;
    onChange?: (value: string) => void;
  }
> = ({ value, onChange }) => {
  return (
    <DatePicker
      showTime
      value={value === undefined ? undefined : value === '' ? null : dayjs(value)}
      onChange={(value) => {
        onChange?.(value !== null ? value.toISOString() : '');
      }}
    />
  );
};

export default DateTimePicker;
