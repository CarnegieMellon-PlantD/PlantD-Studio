import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { DigitalTwinDTO } from '@/types/resourceManager/digitalTwin';

const digitalTwinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listDigitalTwins: build.query<DigitalTwinDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/digitaltwins`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: DigitalTwinDTO[] }) => items,
      providesTags: ['DigitalTwin'],
    }),
    getDigitalTwin: build.query<DigitalTwinDTO, Pick<DigitalTwinDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/digitaltwins/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['DigitalTwin'],
    }),
    createDigitalTwin: build.mutation<void, Pick<DigitalTwinDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/digitaltwins/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['DigitalTwin'],
    }),
    updateDigitalTwin: build.mutation<void, Pick<DigitalTwinDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/digitaltwins/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['DigitalTwin'],
    }),
    deleteDigitalTwin: build.mutation<void, Pick<DigitalTwinDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/digitaltwins/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DigitalTwin'],
    }),
  }),
});

export const {
  useListDigitalTwinsQuery,
  useGetDigitalTwinQuery,
  useLazyGetDigitalTwinQuery,
  useCreateDigitalTwinMutation,
  useUpdateDigitalTwinMutation,
  useDeleteDigitalTwinMutation,
} = digitalTwinApi;
