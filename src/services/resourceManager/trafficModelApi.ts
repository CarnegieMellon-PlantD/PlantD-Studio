import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { TrafficModelDTO } from '@/types/resourceManager/trafficModel';

const trafficModelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTrafficModels: build.query<TrafficModelDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/trafficmodels`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: TrafficModelDTO[] }) => items,
      providesTags: ['TrafficModel'],
    }),
    getTrafficModel: build.query<TrafficModelDTO, Pick<TrafficModelDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/trafficmodels/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['TrafficModel'],
    }),
    createTrafficModel: build.mutation<void, Pick<TrafficModelDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/trafficmodels/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['TrafficModel'],
    }),
    updateTrafficModel: build.mutation<void, Pick<TrafficModelDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/trafficmodels/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['TrafficModel'],
    }),
    deleteTrafficModel: build.mutation<void, Pick<TrafficModelDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/trafficmodels/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TrafficModel'],
    }),
  }),
});

export const {
  useListTrafficModelsQuery,
  useGetTrafficModelQuery,
  useLazyGetTrafficModelQuery,
  useCreateTrafficModelMutation,
  useUpdateTrafficModelMutation,
  useDeleteTrafficModelMutation,
} = trafficModelApi;
