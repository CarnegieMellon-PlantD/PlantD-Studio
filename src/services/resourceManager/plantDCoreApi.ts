import { apiBaseUrl } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { PlantDCoreDTO } from '@/types/resourceManager/plantDCore';

const plantDCoreApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPlantDCore: build.query<PlantDCoreDTO, Pick<PlantDCoreDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBaseUrl}/plantdcores/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['PlantDCore'],
    }),
    updatePlantDCore: build.mutation<void, Pick<PlantDCoreDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBaseUrl}/plantdcores/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['PlantDCore'],
    }),
  }),
});

export const { useGetPlantDCoreQuery, useUpdatePlantDCoreMutation } = plantDCoreApi;
