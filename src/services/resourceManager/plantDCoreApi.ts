import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { PlantDCoreDTO } from '@/types/resourceManager/plantDCore';

const plantDCoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useGetPlantDCoreQuery, useLazyGetPlantDCoreQuery, useUpdatePlantDCoreMutation } = plantDCoreApi;
