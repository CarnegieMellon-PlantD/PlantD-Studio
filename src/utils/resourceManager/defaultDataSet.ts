import { nanoid } from '@reduxjs/toolkit';

import { DataSetVO } from '@/types/resourceManager/dataSet';

export const getDefaultDataSet = (namespace: string): DataSetVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  fileFormat: '',
  useCompression: false,
  compressedFileFormat: '',
  compressPerSchema: false,
  numFiles: 100,
  schemas: [],
});

export const getDefaultDataSetSchema = (): DataSetVO['schemas'][number] => ({
  id: nanoid(),
  name: '',
  numRecords: {
    min: 0,
    max: 0,
  },
  numFilesPerCompressedFile: {
    min: 0,
    max: 0,
  },
});
