import * as React from 'react';
import { Select, SelectProps } from 'antd';

interface ModelTypeSelectProps extends Omit<SelectProps, 'showSearch' | 'options'> {}

const ModelTypeSelect: React.FC<ModelTypeSelectProps> = (props) => {
  const options = ['quickscaling', 'simple'];

  return (
    <Select showSearch {...props}>
      {options.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};

export default ModelTypeSelect;
