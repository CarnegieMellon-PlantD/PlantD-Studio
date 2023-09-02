import { expect, test } from '@jest/globals';

import { getDataSetDTO, getDataSetVO } from './convertDataSet';

test('DTO->VO (detect compression)', () => {
  // No compression when `compressedFileFormat` and `compressPerSchema` are omitted and `schemas` is empty
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        path: '/test',
        fileFormat: 'csv',
        numFiles: 5,
        parallelJobs: 1,
        schemas: [],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'csv',
    useCompression: false,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 5,
    schemas: [],
  });

  // No compression when `compressedFileFormat` is empty and `compressPerSchema` is `false` and all `numFilesPerCompressedFile` are omitted
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        path: '/test',
        fileFormat: 'csv',
        compressedFileFormat: '',
        compressPerSchema: false,
        numFiles: 5,
        parallelJobs: 1,
        schemas: [
          {
            name: 'schema-name',
            numRecords: { min: 100, max: 200 },
          },
        ],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'csv',
    useCompression: false,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 5,
    schemas: [
      {
        id: expect.any(String),
        name: 'schema-name',
        numRecords: { min: 100, max: 200 },
        numFilesPerCompressedFile: { min: 0, max: 0 },
      },
    ],
  });

  // Compression when `compressedFileFormat` is not empty
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        path: '/test',
        fileFormat: 'csv',
        compressedFileFormat: 'zip',
        compressPerSchema: false,
        numFiles: 5,
        parallelJobs: 1,
        schemas: [],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'csv',
    useCompression: true,
    compressedFileFormat: 'zip',
    compressPerSchema: false,
    numFiles: 5,
    schemas: [],
  });

  // Compression when `compressPerSchema` is true
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        path: '/test',
        fileFormat: 'csv',
        compressedFileFormat: '',
        compressPerSchema: true,
        numFiles: 5,
        parallelJobs: 1,
        schemas: [],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'csv',
    useCompression: true,
    compressedFileFormat: '',
    compressPerSchema: true,
    numFiles: 5,
    schemas: [],
  });

  // Compression when not all `numFilesPerCompressedFile` are omitted
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        path: '/test',
        fileFormat: 'csv',
        compressedFileFormat: '',
        compressPerSchema: false,
        numFiles: 5,
        parallelJobs: 1,
        schemas: [
          {
            name: 'schema-name-0',
            numRecords: { min: 100, max: 200 },
            numFilesPerCompressedFile: { min: 0, max: 0 },
          },
          {
            name: 'schema-name-1',
            numRecords: { min: 100, max: 200 },
          },
        ],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: 'csv',
    useCompression: true,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 5,
    schemas: [
      {
        id: expect.any(String),
        name: 'schema-name-0',
        numRecords: { min: 100, max: 200 },
        numFilesPerCompressedFile: { min: 0, max: 0 },
      },
      {
        id: expect.any(String),
        name: 'schema-name-1',
        numRecords: { min: 100, max: 200 },
        numFilesPerCompressedFile: { min: 0, max: 0 },
      },
    ],
  });
});

test('DTO->VO (fallback values)', () => {
  // All empty
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {},
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: '',
    useCompression: false,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 0,
    schemas: [],
  });

  // One empty Schema
  expect(
    getDataSetVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        schemas: [{}],
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    fileFormat: '',
    useCompression: false,
    compressedFileFormat: '',
    compressPerSchema: false,
    numFiles: 0,
    schemas: [
      {
        id: expect.any(String),
        name: '',
        numRecords: { min: 0, max: 0 },
        numFilesPerCompressedFile: { min: 0, max: 0 },
      },
    ],
  });
});

test('VO->DTO', () => {
  expect(
    getDataSetDTO({
      namespace: 'namespace',
      name: 'name',
      fileFormat: 'csv',
      useCompression: true,
      compressedFileFormat: 'zip',
      compressPerSchema: true,
      numFiles: 5,
      schemas: [
        {
          id: 'schema-id',
          name: 'schema-name',
          numRecords: { min: 100, max: 200 },
          numFilesPerCompressedFile: { min: 10, max: 20 },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      path: '/test',
      fileFormat: 'csv',
      compressedFileFormat: 'zip',
      compressPerSchema: true,
      numFiles: 5,
      parallelJobs: 1,
      schemas: [
        {
          name: 'schema-name',
          numRecords: { min: 100, max: 200 },
          numFilesPerCompressedFile: { min: 10, max: 20 },
        },
      ],
    },
  });
});

test('VO->DTO (no compression)', () => {
  // When `useCompression` is `false`, `compressedFileFormat`, `compressPerSchema` and `numFilesPerCompressedFile` are omitted
  expect(
    getDataSetDTO({
      namespace: 'namespace',
      name: 'name',
      fileFormat: 'csv',
      useCompression: false,
      compressedFileFormat: 'zip',
      compressPerSchema: true,
      numFiles: 5,
      schemas: [
        {
          id: 'schema-id',
          name: 'schema-name',
          numRecords: { min: 100, max: 200 },
          numFilesPerCompressedFile: { min: 10, max: 20 },
        },
      ],
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      path: '/test',
      fileFormat: 'csv',
      compressedFileFormat: undefined,
      compressPerSchema: undefined,
      numFiles: 5,
      parallelJobs: 1,
      schemas: [
        {
          name: 'schema-name',
          numRecords: { min: 100, max: 200 },
          numFilesPerCompressedFile: undefined,
        },
      ],
    },
  });
});
