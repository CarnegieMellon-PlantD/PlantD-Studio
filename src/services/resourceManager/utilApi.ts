import { apiBasePath } from '@/constants';
import { baseApi } from '@/services/baseApi';
import { ResourceLocator } from '@/types/resourceManager/utils';

const utilApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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

export const { useCheckHTTPHealthMutation, useListKindsQuery, useListResourcesQuery, useImportResourcesMutation } =
  utilApi;
