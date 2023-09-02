import { dataBaseUrl } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { BiChannelData, TriChannelData } from '@/types/dashboard/data';
import { BiChannelDataRequest, TriChannelDataRequest } from '@/types/dashboard/dataRequests';

const dataSetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBiChannelData: build.query<BiChannelData, BiChannelDataRequest>({
      query: (data) => ({
        url: `${dataBaseUrl}/bi-channel`,
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'GET',
        },
        data,
      }),
      transformResponse: ({ result }: { result: BiChannelData }) => result,
    }),
    getTriChannelData: build.query<TriChannelData, TriChannelDataRequest>({
      query: (data) => ({
        url: `${dataBaseUrl}/tri-channel`,
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

export const { useGetBiChannelDataQuery, useGetTriChannelDataQuery } = dataSetApi;
