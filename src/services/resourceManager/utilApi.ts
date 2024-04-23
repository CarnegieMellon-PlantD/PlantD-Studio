import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { SecretDTO } from '@/types/resourceManager/secret';
import { ServiceDTO } from '@/types/resourceManager/service';
import { ResourceLocator } from '@/types/resourceManager/utils';

const utilApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listServices: build.query<ServiceDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/services`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: ServiceDTO[] }) => items,
    }),
    listSecrets: build.query<SecretDTO[], void>({
      query: () => ({
        url: `${apiBasePath}/secrets`,
        method: 'GET',
      }),
      // Unwrap the response object
      transformResponse: ({ items }: { items: SecretDTO[] }) => items,
    }),
    getSecret: build.query<SecretDTO, Pick<SecretDTO, 'metadata'>>({
      query: ({ metadata }) => ({
        url: `${apiBasePath}/secrets/${metadata.namespace}/${metadata.name}`,
        method: 'GET',
      }),
    }),
    checkHTTPHealth: build.mutation<void, { url: string }>({
      query: ({ url }) => ({
        url: `${apiBasePath}/health/http`,
        method: 'POST',
        headers: {
          'X-HTTP-Method-Override': 'GET',
        },
        data: {
          url,
        },
      }),
    }),
    listKinds: build.query<string[], void>({
      query: () => ({
        url: `${apiBasePath}/kinds`,
      }),
    }),
    listResources: build.query<ResourceLocator[], void>({
      query: () => ({
        url: `${apiBasePath}/resources`,
      }),
    }),
    importResources: build.mutation<{ numSucceeded: number; numFailed: number; errors: string[] }, { file: Blob }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `${apiBasePath}/resources/import`,
          method: 'POST',
          data: formData,
        };
      },
    }),
  }),
});

export const {
  useListServicesQuery,
  useListSecretsQuery,
  useGetSecretQuery,
  useLazyGetSecretQuery,
  useCheckHTTPHealthMutation,
  useListKindsQuery,
  useListResourcesQuery,
  useImportResourcesMutation,
} = utilApi;
