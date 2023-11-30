import { apiBasePath } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { LoadPatternDTO } from '@/types/resourceManager/loadPattern';

const loadPatternApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listLoadPatterns: build.query<LoadPatternDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/loadpatterns`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: LoadPatternDTO[] }) => items,
      providesTags: ['LoadPattern'],
    }),
    getLoadPattern: build.query<LoadPatternDTO, Pick<LoadPatternDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/loadpatterns/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['LoadPattern'],
    }),
    createLoadPattern: build.mutation<void, Pick<LoadPatternDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/loadpatterns/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['LoadPattern'],
    }),
    updateLoadPattern: build.mutation<void, Pick<LoadPatternDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/loadpatterns/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['LoadPattern'],
    }),
    deleteLoadPattern: build.mutation<void, Pick<LoadPatternDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/loadpatterns/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LoadPattern'],
    }),
  }),
});

export const {
  useListLoadPatternsQuery,
  useGetLoadPatternQuery,
  useLazyGetLoadPatternQuery,
  useCreateLoadPatternMutation,
  useUpdateLoadPatternMutation,
  useDeleteLoadPatternMutation,
} = loadPatternApi;
