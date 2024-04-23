import { expect, test } from '@jest/globals';

import { DataSetDTO } from '@/types/resourceManager/dataSet';
import { getDataSetDTO, getDataSetVO } from './convertDataSet';

test('DTO->VO, Default', () => {
  const dtoIn: DataSetDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {},
    status: {},
  };
  const vo = getDataSetVO(dtoIn);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    fileFormat: '',
    useCompression: false,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 0,
    schemas: [],
  });
});

test('DTO->VO->DTO, No Compression', () => {
  const dtoIn: DataSetDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      image: 'image',
      parallelism: 10,
      storageSize: 'storage-size',
      fileFormat: 'file-format',
      compressedFileFormat: '',
      numFiles: 100,
      schemas: [
        {
          name: 'schema-name',
          numRecords: {
            min: 1,
            max: 2,
          },
          numFilesPerCompressedFile: {
            min: 3,
            max: 4,
          },
        },
      ],
    },
    status: {},
  };
  const vo = getDataSetVO(dtoIn);
  const dtoOut = getDataSetDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'file-format',
    useCompression: false,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 100,
    schemas: [
      {
        id: expect.any(String),
        name: 'schema-name',
        numRecords: {
          min: 1,
          max: 2,
        },
        numFilesPerCompressedFile: {
          min: 3,
          max: 4,
        },
      },
    ],
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      image: 'image',
      parallelism: 10,
      storageSize: 'storage-size',
      fileFormat: 'file-format',
      compressedFileFormat: undefined,
      compressPerSchema: undefined,
      numFiles: 100,
      schemas: [
        {
          name: 'schema-name',
          numRecords: {
            min: 1,
            max: 2,
          },
          numFilesPerCompressedFile: undefined,
        },
      ],
    },
  });
});

test('DTO->VO->DTO, Compression', () => {
  const dtoIn: DataSetDTO = {
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      image: 'image',
      parallelism: 10,
      storageSize: 'storage-size',
      fileFormat: 'file-format',
      compressedFileFormat: 'compressed-file-format',
      compressPerSchema: true,
      numFiles: 100,
      schemas: [
        {
          name: 'schema-name',
          numRecords: {
            min: 1,
            max: 2,
          },
          numFilesPerCompressedFile: {
            min: 3,
            max: 4,
          },
        },
      ],
    },
    status: {},
  };
  const vo = getDataSetVO(dtoIn);
  const dtoOut = getDataSetDTO(vo);

  expect(vo).toStrictEqual({
    originalObject: dtoIn.spec,
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'file-format',
    useCompression: true,
    compressedFileFormat: 'compressed-file-format',
    compressPerSchema: true,
    numFiles: 100,
    schemas: [
      {
        id: expect.any(String),
        name: 'schema-name',
        numRecords: {
          min: 1,
          max: 2,
        },
        numFilesPerCompressedFile: {
          min: 3,
          max: 4,
        },
      },
    ],
  });

  expect(dtoOut).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      image: 'image',
      parallelism: 10,
      storageSize: 'storage-size',
      fileFormat: 'file-format',
      compressedFileFormat: 'compressed-file-format',
      compressPerSchema: true,
      numFiles: 100,
      schemas: [
        {
          name: 'schema-name',
          numRecords: {
            min: 1,
            max: 2,
          },
          numFilesPerCompressedFile: {
            min: 3,
            max: 4,
          },
        },
      ],
    },
  });
});
