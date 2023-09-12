import axios from 'axios';
import fileDownload from 'js-file-download';

import { apiBaseUrl } from '@/constants/base';

export const downloadSampleDataSet = async (namespace: string, name: string) => {
  const response = await axios({
    url: `${apiBaseUrl}/datasets/${namespace}/${name}/sample`,
    method: 'GET',
    responseType: 'blob',
  });
  const contentDisposition: string = response.headers['content-disposition'];
  const filename = contentDisposition.match(/^.*filename=(.+).*$/)?.[1];
  if (filename === undefined) {
    throw new Error('Filename not found in response header');
  }
  fileDownload(response.data, filename);
};
