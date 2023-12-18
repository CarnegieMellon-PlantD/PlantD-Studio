import { apiBasePath } from '@/constants';
import { namespaceNoReservedKeywordRegExp } from '@/constants/resourceManager/regExps';
import { baseApi } from '@/services/baseApi';
import { NamespaceDTO } from '@/types/resourceManager/namespace';

const namespaceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listNamespaces: build.query<NamespaceDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/namespaces`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: NamespaceDTO[] }) =>
        items.filter((item) => item.metadata.name.match(namespaceNoReservedKeywordRegExp) !== null),
      providesTags: ['Namespace'],
    }),
    createNamespace: build.mutation<void, Pick<NamespaceDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/namespaces/${metadata.name}`,
        method: 'POST',
      }),
      invalidatesTags: ['Namespace'],
    }),
    deleteNamespace: build.mutation<void, Pick<NamespaceDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/namespaces/${metadata.name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Namespace'],
    }),
  }),
});

export const { useListNamespacesQuery, useCreateNamespaceMutation, useDeleteNamespaceMutation } = namespaceApi;
