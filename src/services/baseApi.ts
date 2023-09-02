import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export type AxiosBaseQueryFnArgs = AxiosRequestConfig;

export type AxiosBaseQueryFnResult = unknown;

export type AxiosBaseQueryFnError = {
  status: number | undefined;
  data: AxiosError;
};

export type AxiosBaseQueryFn = BaseQueryFn<AxiosBaseQueryFnArgs, AxiosBaseQueryFnResult, AxiosBaseQueryFnError>;

const axiosBaseQuery =
  ({ baseUrl = '' } = {}): AxiosBaseQueryFn =>
  async ({ url, ...rest }) => {
    try {
      const result = await axios({ url: baseUrl + url, ...rest });
      return { data: result.data };
    } catch (err) {
      return {
        error: {
          status: (err as AxiosError).response?.status,
          data: err as AxiosError,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Namespace', 'Schema', 'DataSet', 'LoadPattern', 'Pipeline', 'Experiment'],
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
});
