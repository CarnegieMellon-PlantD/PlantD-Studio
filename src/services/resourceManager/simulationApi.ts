import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { SimulationDTO } from '@/types/resourceManager/simulation';

const simulationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listSimulations: build.query<SimulationDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/simulations`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: SimulationDTO[] }) => items,
      providesTags: ['Simulation'],
    }),
    getSimulation: build.query<SimulationDTO, Pick<SimulationDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/simulations/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['Simulation'],
    }),
    createSimulation: build.mutation<void, Pick<SimulationDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/simulations/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Simulation'],
    }),
    updateSimulation: build.mutation<void, Pick<SimulationDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/simulations/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Simulation'],
    }),
    deleteSimulation: build.mutation<void, Pick<SimulationDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/simulations/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Simulation'],
    }),
  }),
});

export const {
  useListSimulationsQuery,
  useGetSimulationQuery,
  useLazyGetSimulationQuery,
  useCreateSimulationMutation,
  useUpdateSimulationMutation,
  useDeleteSimulationMutation,
} = simulationApi;
