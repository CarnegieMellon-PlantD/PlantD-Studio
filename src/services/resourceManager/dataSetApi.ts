import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { DataSetDTO } from '@/types/resourceManager/dataSet';

const dataSetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listDataSets: build.query<DataSetDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/datasets`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: DataSetDTO[] }) => items,
      providesTags: ['DataSet'],
    }),
    getDataSet: build.query<DataSetDTO, Pick<DataSetDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/datasets/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['DataSet'],
    }),
    createDataSet: build.mutation<void, Pick<DataSetDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/datasets/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['DataSet'],
    }),
    updateDataSet: build.mutation<void, Pick<DataSetDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/datasets/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['DataSet'],
    }),
    deleteDataSet: build.mutation<void, Pick<DataSetDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/datasets/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DataSet'],
    }),
  }),
});

export const {
  useListDataSetsQuery,
  useGetDataSetQuery,
  useLazyGetDataSetQuery,
  useCreateDataSetMutation,
  useUpdateDataSetMutation,
  useDeleteDataSetMutation,
} = dataSetApi;
