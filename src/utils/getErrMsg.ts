import { SerializedError } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { AxiosBaseQueryFnError } from '@/services/baseApi';

type ErrorPayload = {
  message: string;
};

/**
 * Get error message from AxiosError object
 * @param error AxiosError object
 * @returns Error message in string
 */
export const getAxiosErrMsg = (error: AxiosError): string => {
  // If `error.response.data.message` is defined, use it as error message, otherwise use `error.message`
  return (error.response?.data as ErrorPayload)?.message || error.message;
};

/**
 * Get error message from AxiosError object where the response is of type `Blob`
 * @param error AxiosError object
 * @returns Error message in string
 */
export const getAxiosBlobErrMsg = async (error: AxiosError<Blob>): Promise<string> => {
  // If `error.response.data.message` is defined, use it as error message, otherwise use `error.message`
  // Note that `error.response.data` is of type `Blob`
  try {
    const data = await error.response?.data?.text?.();
    return (data !== undefined && (JSON.parse(data) as ErrorPayload)?.message) || error.message;
  } catch {
    return error.message;
  }
};

/**
 * A type-safe approach to get error message from RTK Query error object
 * @param error Error object, either of type `AxiosBaseQueryFnError` or `SerializedError`
 * @returns Error message in string
 */
export const getErrMsg = (error: AxiosBaseQueryFnError | SerializedError): string => {
  if ('status' in error) {
    // Is `AxiosBaseQueryFnError`
    return getAxiosErrMsg(error.data);
  } else {
    // Is `SerializedError`
    return error.message ?? 'Unknown error';
  }
};
