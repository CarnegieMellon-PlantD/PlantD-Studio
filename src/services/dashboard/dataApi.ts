import { dataBasePath } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { BiChannelDataRequest, TriChannelDataRequest } from '@/types/dashboard/dataRequests';
import { BiChannelData, TriChannelData } from '@/types/dashboard/dataResponses';

const dataSetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useGetBiChannelDataQuery, useGetTriChannelDataQuery } = dataSetApi;
