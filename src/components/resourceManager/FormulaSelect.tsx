import * as React from 'react';
import { Select, SelectProps } from 'antd';

import { schemaColumnFormulas } from '@/constants/resourceManager/schemaColumnFormulas';

const FormulaSelect: React.FC<Omit<SelectProps, 'showSearch' | 'filterOption' | 'options'>> = (props) => {
  return (
    <Select
      showSearch
      filterOption={(inputValue, option) => {
        const originalOption = schemaColumnFormulas.find(({ name }) => name === option?.value);
        if (originalOption === undefined) {
          return false;
        }
        const lowerCasedInputValue = inputValue.toLowerCase();
        return (
          originalOption.name.toLowerCase().includes(lowerCasedInputValue) ||
          originalOption.description.toLowerCase().includes(lowerCasedInputValue)
        );
      }}
      optionLabelProp="value"
      {...props}
    >
      {schemaColumnFormulas.map((formula) => (
        <Select.Option key={formula.name} value={formula.name}>
          <p className="my-0">{formula.name}</p>
          {/* Break long text into multiple lines */}
          <p className="my-0 text-xs text-gray-400 whitespace-normal break-words">{formula.description}</p>
          <p className="my-0 text-xs italic text-gray-400 whitespace-normal break-words">Output: {formula.output}</p>
        </Select.Option>
      ))}
    </Select>
  );
};

export default FormulaSelect;
