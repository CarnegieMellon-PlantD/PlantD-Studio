import * as React from 'react';
import { Select, SelectProps } from 'antd';

interface ModelTypeSelectProps extends Omit<SelectProps, 'showSearch' | 'options'> {}

const ModelTypeSelect: React.FC<ModelTypeSelectProps> = (props) => {
  const options = [
    { type: 'quickscaling', value: 'Quick Scaling' },
    { type: 'simple', value: 'Simple' },
  ];

  return (
    <Select showSearch {...props}>
      {options.map((option) => (
        <Select.Option key={option.type} value={option.type}>
          {option.value}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ModelTypeSelect;
