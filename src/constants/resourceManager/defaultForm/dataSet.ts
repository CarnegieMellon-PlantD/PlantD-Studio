import { DataSetVO } from '@/types/resourceManager/dataSet';

export const getDefaultDataSetForm = (namespace: string): DataSetVO => ({
  namespace: namespace,
  name: '',
  fileFormat: '',
  useCompression: false,
  compressedFileFormat: '',
  compressPerSchema: false,
  numFiles: 0,
  schemas: [],
});
