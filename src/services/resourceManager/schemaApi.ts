import { apiBasePath } from '@/constants/base';
import { baseApi } from '@/services/baseApi';
import { SchemaDTO } from '@/types/resourceManager/schema';

const schemaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listSchemas: build.query<SchemaDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/schemas`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: SchemaDTO[] }) => items,
      providesTags: ['Schema'],
    }),
    getSchema: build.query<SchemaDTO, Pick<SchemaDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/schemas/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
      providesTags: ['Schema'],
    }),
    createSchema: build.mutation<void, Pick<SchemaDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/schemas/${metadata.namespace}/${metadata.name}`,
        method: 'POST',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Schema'],
    }),
    updateSchema: build.mutation<void, Pick<SchemaDTO, 'metadata' | 'spec'>>({
      query: ({ metadata, spec }) => ({
        url: `${apiBasePath}/schemas/${metadata.namespace}/${metadata.name}`,
        method: 'PUT',
        data: {
          spec,
        },
      }),
      invalidatesTags: ['Schema'],
    }),
    deleteSchema: build.mutation<void, Pick<SchemaDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/schemas/${metadata.namespace}/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schema'],
    }),
  }),
});

export const {
  useListSchemasQuery,
  useLazyGetSchemaQuery,
  useCreateSchemaMutation,
  useUpdateSchemaMutation,
  useDeleteSchemaMutation,
} = schemaApi;
