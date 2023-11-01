import { useMemo } from 'react';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { QueryDefinition } from '@reduxjs/toolkit/query';
import { Select, SelectProps } from 'antd';

import { useResourceList } from '@/hooks/resourceManager/useResourceList';
import { AxiosBaseQueryFn } from '@/services/baseApi';

interface BaseResourceSelectProps<DTO> extends Omit<SelectProps, 'showSearch' | 'loading' | 'options'> {
  /** Resource kind */
  resourceKind: string;
  /** Hook for listing resources */
  listHook: UseQuery<QueryDefinition<void, AxiosBaseQueryFn, string, DTO[]>>;
  /** Callback to filter resources */
  filter?: (resource: DTO) => boolean;
}

const BaseResourceSelect = <DTO extends { metadata: { name: string } }>({
  resourceKind,
  listHook,
  filter,
  ...props
}: BaseResourceSelectProps<DTO>) => {
  const { data, isFetching, isSuccess } = useResourceList({
    resourceKind,
    listHook,
  });

  const options = useMemo(
    () =>
      isSuccess && data !== undefined
        ? data.filter((resource) => filter?.(resource) ?? true).map((resource) => resource.metadata.name)
        : [],
    [filter, isSuccess, data]
  );

  return (
    <Select showSearch loading={isFetching} {...props}>
      {options.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};

export default BaseResourceSelect;
