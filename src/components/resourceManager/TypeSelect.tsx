import * as React from 'react';
import { useMemo } from 'react';
import { Select, SelectProps } from 'antd';

import { schemaColumnTypes } from '@/constants/resourceManager/schemaColumnTypes';
import { SchemaColumnTypes } from '@/types/resourceManager/schemaColumnTypes';

const TypeSelect: React.FC<Omit<SelectProps, 'showSearch' | 'filterOption' | 'options'>> = (props) => {
  const categorizedSchemaColumnTypes = useMemo(() => {
    const result: Record<string, Record<string, SchemaColumnTypes[string]>> = {};
    Object.entries(schemaColumnTypes).forEach(([typeName, typeInfo]) => {
      if (!Object.keys(result).includes(typeInfo.category)) {
        result[typeInfo.category] = {};
      }
      result[typeInfo.category][typeName] = typeInfo;
    });
    return result;
  }, []);

  return (
    <Select
      showSearch
      filterOption={(inputValue, option) => {
        if (option === undefined) {
          return false;
        }
        if ((option.value as string | undefined)?.includes(inputValue)) {
          return true;
        }
        const originalOption = schemaColumnTypes[option.value as string];
        if (originalOption === undefined) {
          return false;
        }
        const lowerCasedInputValue = inputValue.toLowerCase();
        return (
          originalOption.category.toLowerCase().includes(lowerCasedInputValue) ||
          originalOption.display.toLowerCase().includes(lowerCasedInputValue) ||
          originalOption.description.toLowerCase().includes(lowerCasedInputValue)
        );
      }}
      optionLabelProp="value"
      {...props}
    >
      {Object.entries(categorizedSchemaColumnTypes).map(([typeCategory, types]) => (
        <Select.OptGroup key={typeCategory} label={typeCategory.toUpperCase()}>
          {Object.entries(types).map(([typeName, typeInfo]) => (
            <Select.Option key={typeName} value={typeName}>
              <div>{typeInfo.display}</div>
              {/* Break long text into multiple lines */}
              <div className="text-xs text-gray-400 whitespace-normal break-words">{typeInfo.description}</div>
              <div className="text-xs italic text-gray-400 whitespace-normal break-words">
                Output: {typeInfo.output}
              </div>
            </Select.Option>
          ))}
        </Select.OptGroup>
      ))}
    </Select>
  );
};

export default TypeSelect;
