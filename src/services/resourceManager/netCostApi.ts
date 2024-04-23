import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { NetCostDTO } from '@/types/resourceManager/netCost';

const netCostApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listNetCosts: build.query<NetCostDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/netcosts`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: NetCostDTO[] }) => items,
      providesTags: ['NetCost'],
    }),
    getNetCost: build.query<NetCostDTO, Pick<NetCostDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/netcosts/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['NetCost'],
    }),
    createNetCost: build.mutation<void, Pick<NetCostDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/netcosts/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['NetCost'],
    }),
    updateNetCost: build.mutation<void, Pick<NetCostDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/netcosts/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['NetCost'],
    }),
    deleteNetCost: build.mutation<void, Pick<NetCostDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/netcosts/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['NetCost'],
    }),
  }),
});

export const {
  useListNetCostsQuery,
  useGetNetCostQuery,
  useLazyGetNetCostQuery,
  useCreateNetCostMutation,
  useUpdateNetCostMutation,
  useDeleteNetCostMutation,
} = netCostApi;
