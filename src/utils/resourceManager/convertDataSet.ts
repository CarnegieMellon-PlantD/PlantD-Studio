import { nanoid } from '@reduxjs/toolkit';

import { DataSetDTO, DataSetVO } from '@/types/resourceManager/dataSet';

/**
 * Convert the data transfer object of a DataSet to the view object
 * @param dto The data transfer object of a DataSet
 * @returns The view object of a DataSet
 */
export const getDataSetVO = (dto: DataSetDTO): DataSetVO => {
  const useCompression = dto.spec.compressedFileFormat !== undefined && dto.spec.compressedFileFormat !== '';

  const vo: DataSetVO = {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    fileFormat: dto.spec.fileFormat ?? '',
    useCompression,
    compressedFileFormat: dto.spec.compressedFileFormat ?? '',
    compressPerSchema: dto.spec.compressPerSchema ?? false,
    numFiles: dto.spec.numFiles ?? 0,
    schemas: [],
  };

  if (dto.spec.schemas !== undefined) {
    vo.schemas = dto.spec.schemas.map((schema) => ({
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
    }));
  }

  return vo;
};

/**
 * Convert the view object of a DataSet to the data transfer object
 * @param vo The view object of a DataSet
 * @returns The data transfer object of a DataSet
 */
export const getDataSetDTO = (vo: DataSetVO): Pick<DataSetDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      fileFormat: vo.fileFormat,
      compressedFileFormat: vo.useCompression ? vo.compressedFileFormat : undefined,
      compressPerSchema: vo.useCompression ? vo.compressPerSchema : undefined,
      numFiles: vo.numFiles,
      schemas: vo.schemas.map((schema) => ({
        name: schema.name,
        numRecords: schema.numRecords,
        numFilesPerCompressedFile: vo.useCompression ? schema.numFilesPerCompressedFile : undefined,
      })),
    },
  };
};
