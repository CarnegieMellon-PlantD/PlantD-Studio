import { nanoid } from '@reduxjs/toolkit';

import { DataSetDTO, DataSetVO } from '@/types/resourceManager/dataSet';

/**
 * Convert the data transfer object of a DataSet to the view object
 * @param dataSetDTO The data transfer object of a DataSet
 * @returns The view object of a DataSet
 */
export const getDataSetVO = (dataSetDTO: DataSetDTO): DataSetVO => {
  return {
    namespace: dataSetDTO.metadata.namespace,
    name: dataSetDTO.metadata.name,
    fileFormat: dataSetDTO.spec.fileFormat ?? '',
    useCompression:
      (dataSetDTO.spec.compressedFileFormat !== undefined && dataSetDTO.spec.compressedFileFormat !== '') ||
      dataSetDTO.spec.compressPerSchema === true ||
      (dataSetDTO.spec.schemas !== undefined &&
        dataSetDTO.spec.schemas.some((schema) => schema.numFilesPerCompressedFile !== undefined)),
    compressedFileFormat: dataSetDTO.spec.compressedFileFormat ?? '',
    compressPerSchema: dataSetDTO.spec.compressPerSchema ?? false,
    numFiles: dataSetDTO.spec.numFiles ?? 0,
    schemas:
      dataSetDTO.spec.schemas === undefined
        ? []
        : dataSetDTO.spec.schemas.map((schema) => ({
            id: nanoid(),
            name: schema.name ?? '',
            numRecords: {
              min: schema.numRecords?.min ?? 0,
              max: schema.numRecords?.max ?? 0,
            },
            numFilesPerCompressedFile: {
              min: schema.numFilesPerCompressedFile?.min ?? 0,
              max: schema.numFilesPerCompressedFile?.max ?? 0,
            },
          })),
  };
};

/**
 * Convert the view object of a DataSet to the data transfer object
 * @param dataSetVO The view object of a DataSet
 * @returns The data transfer object of a DataSet
 */
export const getDataSetDTO = (dataSetVO: DataSetVO): Pick<DataSetDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: dataSetVO.namespace,
      name: dataSetVO.name,
    },
    spec: {
      fileFormat: dataSetVO.fileFormat,
      compressedFileFormat: dataSetVO.useCompression ? dataSetVO.compressedFileFormat : undefined,
      compressPerSchema: dataSetVO.useCompression && dataSetVO.compressPerSchema ? true : undefined,
      numFiles: dataSetVO.numFiles,
      schemas: dataSetVO.schemas.map((schema) => ({
        name: schema.name,
        numRecords: schema.numRecords,
        numFilesPerCompressedFile: dataSetVO.useCompression ? schema.numFilesPerCompressedFile : undefined,
      })),
    },
  };
};
