import { apiBasePath } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { CostExporterDTO } from '@/types/resourceManager/costExporter';

const costExporterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listCostExporters: build.query<CostExporterDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/costexporters`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: CostExporterDTO[] }) => items,
      providesTags: ['CostExporter'],
    }),
    getCostExporter: build.query<CostExporterDTO, Pick<CostExporterDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/costexporters/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['CostExporter'],
    }),
    createCostExporter: build.mutation<void, Pick<CostExporterDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/costexporters/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['CostExporter'],
    }),
    updateCostExporter: build.mutation<void, Pick<CostExporterDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/costexporters/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['CostExporter'],
    }),
    deleteCostExporter: build.mutation<void, Pick<CostExporterDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/costexporters/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CostExporter'],
    }),
  }),
});

export const {
  useListCostExportersQuery,
  useGetCostExporterQuery,
  useLazyGetCostExporterQuery,
  useCreateCostExporterMutation,
  useUpdateCostExporterMutation,
  useDeleteCostExporterMutation,
} = costExporterApi;
