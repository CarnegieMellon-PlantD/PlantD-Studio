import { dataBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { BiChannelDataRequest, RedisRawDataRequest, TriChannelDataRequest } from '@/types/dashboard/dataRequests';
import { BiChannelData, RedisRawData, TriChannelData } from '@/types/dashboard/dataResponses';

const dataSetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRedisRawData: build.query<RedisRawData, RedisRawDataRequest>({
      query: (data) => ({
        url: `${dataBasePath}/raw/redis`,
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'GET',
        },
        data,
      }),
      transformResponse: async (response: { result: string }): Promise<RedisRawData> => {
        try {
          const parsedResult = JSON.parse(response.result);
          const data = parsedResult.index.map((row: unknown[], rowIndex: number) => {
            const obj: Record<string, unknown> = {};
            parsedResult.columns.forEach((column: string, columnIndex: number) => {
              obj[column] = parsedResult.data[rowIndex][columnIndex];
            });
            return obj;
          });

          return data;
        } catch (error) {
          console.error('Error parsing JSON:', error);
          throw error;
        }
      },
    }),
    getBiChannelData: build.query<BiChannelData, BiChannelDataRequest>({
      query: ({ __source, ...data }) => ({
        url: `${dataBasePath}/bi-channel/${__source}`,
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'GET',
        },
        data,
      }),
      transformResponse: ({ result }: { result: BiChannelData }) => result,
    }),
    getTriChannelData: build.query<TriChannelData, TriChannelDataRequest>({
      query: ({ __source, ...data }) => ({
        url: `${dataBasePath}/tri-channel/${__source}`,
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'GET',
        },
        data,
      }),
      transformResponse: ({ result }: { result: TriChannelData }) => result,
    }),
  }),
});

export const { useGetRedisRawDataQuery, useGetBiChannelDataQuery, useGetTriChannelDataQuery } = dataSetApi;
