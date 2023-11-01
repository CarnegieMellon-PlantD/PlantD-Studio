import { apiBasePath } from '@/constants/base';
import { baseApi } from '@/services/baseApi';

const utilApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    importResources: build.mutation<{ numSucceeded: number; numFailed: number; errors: string[] }, { file: Blob }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `${apiBasePath}/import`,
          method: 'POST',
          data: formData,
        };
      },
    }),
  }),
});

export const { useImportResourcesMutation } = utilApi;
