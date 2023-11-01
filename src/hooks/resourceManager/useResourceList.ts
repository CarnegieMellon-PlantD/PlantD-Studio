import { useTranslation } from 'react-i18next';
import { UseQuery, UseQueryHookResult } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { QueryDefinition } from '@reduxjs/toolkit/query';
import { App } from 'antd';
import { useUpdateEffect } from 'usehooks-ts';

import { AxiosBaseQueryFn } from '@/services/baseApi';
import { getErrMsg } from '@/utils/getErrMsg';

type UseResourceListOptions<DTO_L> = {
  /** Resource kind */
  resourceKind: string;
  /** Hook for listing resources */
  listHook: UseQuery<QueryDefinition<void, AxiosBaseQueryFn, string, DTO_L>>;
  /** Interval for polling in milliseconds, default to `0` which disables polling */
  pollingInterval?: number;
};

type UseResourceListResults<DTO_L> = UseQueryHookResult<QueryDefinition<void, AxiosBaseQueryFn, string, DTO_L>>;

export const useResourceList = <DTO_L>({
  resourceKind,
  listHook,
  pollingInterval = 0,
}: UseResourceListOptions<DTO_L>): UseResourceListResults<DTO_L> => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const result = listHook(undefined, { pollingInterval });
  const { isError, error } = result;

  // Show error message if failed to list resources
  useUpdateEffect(() => {
    if (isError && error !== undefined) {
      message.error(t('Failed to list {kind} resources: {error}', { kind: resourceKind, error: getErrMsg(error) }));
    }
  }, [isError, error]);

  return result;
};
