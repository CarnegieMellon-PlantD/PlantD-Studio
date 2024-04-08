import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { ScenarioDTO } from '@/types/resourceManager/scenario';

const scenarioApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listScenarios: build.query<ScenarioDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/scenarios`,
        method: 'GET',
      }),
      transformResponse: ({ items }: { items: ScenarioDTO[] }) => items,
      providesTags: ['Scenario'],
    }),
    getScenario: build.query<ScenarioDTO, Pick<ScenarioDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/scenarios/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['Scenario'],
    }),
    createScenario: build.mutation<void, Pick<ScenarioDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/scenarios/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Scenario'],
    }),
    updateScenario: build.mutation<void, Pick<ScenarioDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/scenarios/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Scenario'],
    }),
    deleteScenario: build.mutation<void, Pick<ScenarioDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/scenarios/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scenario'],
    }),
  }),
});

export const {
  useListScenariosQuery,
  useGetScenarioQuery,
  useLazyGetScenarioQuery,
  useCreateScenarioMutation,
  useUpdateScenarioMutation,
  useDeleteScenarioMutation,
} = scenarioApi;
