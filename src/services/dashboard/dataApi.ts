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
          console.log(parsedResult);
          // Combine column names and data into an array of objects
          const data = parsedResult.index.map((row: unknown[], rowIndex: number) => {
            const obj: Record<string, unknown> = {};
            parsedResult.columns.forEach((column: string, columnIndex: number) => {
              obj[column] = parsedResult.data[rowIndex][columnIndex];
            });
            return obj;
          });
          console.log(data);
          const numericData = data.map(
            (item: { date: string | number | Date; latency_fifo: string; throughput: string; queue_len: string }) => {
              // Convert 'time' to a JavaScript Date object
              const time = new Date(item.date);
              return {
                ...item,
                latency_fifo: parseFloat(item.latency_fifo),
                throughput: parseFloat(item.throughput),
                time: time, // Use the converted time here
                queue_len: parseFloat(item.queue_len),
                // Add similar lines for other fields that should be numeric
              };
            }
          );
          console.log(numericData);

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
