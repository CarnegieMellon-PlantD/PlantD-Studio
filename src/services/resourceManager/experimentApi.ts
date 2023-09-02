import { apiBaseUrl } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { ExperimentDTO } from '@/types/resourceManager/experiment';

const experimentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listExperiments: build.query<ExperimentDTO[], void>({
      query: () => ({
        url: `${apiBaseUrl}/experiments`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: ExperimentDTO[] }) => items,
      providesTags: ['Experiment'],
    }),
    getExperiment: build.query<ExperimentDTO, Pick<ExperimentDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBaseUrl}/experiments/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['Experiment'],
    }),
    createExperiment: build.mutation<void, Pick<ExperimentDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBaseUrl}/experiments/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Experiment'],
    }),
    updateExperiment: build.mutation<void, Pick<ExperimentDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBaseUrl}/experiments/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Experiment'],
    }),
    deleteExperiment: build.mutation<void, Pick<ExperimentDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBaseUrl}/experiments/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experiment'],
    }),
  }),
});

export const {
  useListExperimentsQuery,
  useLazyGetExperimentQuery,
  useCreateExperimentMutation,
  useUpdateExperimentMutation,
  useDeleteExperimentMutation,
} = experimentApi;
