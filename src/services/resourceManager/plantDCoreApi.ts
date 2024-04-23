import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { PlantDCoreDTO } from '@/types/resourceManager/plantDCore';

const plantDCoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPlantDCore: build.query<PlantDCoreDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/plantdcores`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: PlantDCoreDTO[] }) => items,
      providesTags: ['PlantDCore'],
    }),
    getPlantDCore: build.query<PlantDCoreDTO, Pick<PlantDCoreDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/plantdcores/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['PlantDCore'],
    }),
    updatePlantDCore: build.mutation<void, Pick<PlantDCoreDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/plantdcores/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['PlantDCore'],
    }),
  }),
});

export const { useListPlantDCoreQuery, useGetPlantDCoreQuery, useLazyGetPlantDCoreQuery, useUpdatePlantDCoreMutation } =
  plantDCoreApi;
