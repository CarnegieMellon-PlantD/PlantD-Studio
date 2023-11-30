import { apiBasePath } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { PipelineDTO } from '@/types/resourceManager/pipeline';

const pipelineApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPipelines: build.query<PipelineDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/pipelines`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: PipelineDTO[] }) => items,
      providesTags: ['Pipeline'],
    }),
    getPipeline: build.query<PipelineDTO, Pick<PipelineDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/pipelines/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['Pipeline'],
    }),
    createPipeline: build.mutation<void, Pick<PipelineDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/pipelines/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Pipeline'],
    }),
    updatePipeline: build.mutation<void, Pick<PipelineDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/pipelines/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Pipeline'],
    }),
    deletePipeline: build.mutation<void, Pick<PipelineDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/pipelines/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pipeline'],
    }),
  }),
});

export const {
  useListPipelinesQuery,
  useGetPipelineQuery,
  useLazyGetPipelineQuery,
  useCreatePipelineMutation,
  useUpdatePipelineMutation,
  useDeletePipelineMutation,
} = pipelineApi;
