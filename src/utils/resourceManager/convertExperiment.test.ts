import { expect, test } from '@jest/globals';

import { getExperimentDTO, getExperimentVO } from './convertExperiment';

test('DTO->VO', () => {
  expect(
    getExperimentVO({
      metadata: {
        namespace: 'namespace',
        name: 'name',
      },
      spec: {
        pipelineRef: {
          namespace: 'pipeline-namespace',
          name: 'pipeline-name',
        },
        loadPatterns: [
          {
            endpointName: 'endpoint-name',
            loadPatternRef: {
              namespace: 'loadPattern-namespace',
              name: 'loadPattern-name',
            },
          },
        ],
        scheduledTime: '2000-01-01T00:00:00Z',
      },
      status: {},
    })
  ).toStrictEqual({
    namespace: 'namespace',
    name: 'name',
    pipelineRef: {
      namespace: 'pipeline-namespace',
      name: 'pipeline-name',
    },
    loadPatterns: [
      {
        endpointName: 'endpoint-name',
        loadPatternRef: {
          namespace: 'loadPattern-namespace',
          name: 'loadPattern-name',
        },
      },
    ],
    hasScheduledTime: true,
    scheduledTime: '2000-01-01T00:00:00Z',
  });
});

test('DTO->VO (fallback values)', () => {
  expect(
    getExperimentVO({
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
    pipelineRef: {
      namespace: '',
      name: '',
    },
    loadPatterns: [],
    hasScheduledTime: false,
    scheduledTime: '',
  });
});

test('VO->DTO', () => {
  // `hasScheduledTime` is `true`
  expect(
    getExperimentDTO({
      namespace: 'namespace',
      name: 'name',
      pipelineRef: {
        namespace: 'pipeline-namespace',
        name: 'pipeline-name',
      },
      loadPatterns: [
        {
          endpointName: 'endpoint-name',
          loadPatternRef: {
            namespace: 'loadPattern-namespace',
            name: 'loadPattern-name',
          },
        },
      ],
      hasScheduledTime: true,
      scheduledTime: '2000-01-01T00:00:00Z',
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineRef: {
        namespace: 'pipeline-namespace',
        name: 'pipeline-name',
      },
      loadPatterns: [
        {
          endpointName: 'endpoint-name',
          loadPatternRef: {
            namespace: 'loadPattern-namespace',
            name: 'loadPattern-name',
          },
        },
      ],
      scheduledTime: '2000-01-01T00:00:00Z',
    },
  });

  // `hasScheduledTime` is `false`
  expect(
    getExperimentDTO({
      namespace: 'namespace',
      name: 'name',
      pipelineRef: {
        namespace: 'pipeline-namespace',
        name: 'pipeline-name',
      },
      loadPatterns: [
        {
          endpointName: 'endpoint-name',
          loadPatternRef: {
            namespace: 'loadPattern-namespace',
            name: 'loadPattern-name',
          },
        },
      ],
      hasScheduledTime: false,
      scheduledTime: '2000-01-01T00:00:00Z',
    })
  ).toStrictEqual({
    metadata: {
      namespace: 'namespace',
      name: 'name',
    },
    spec: {
      pipelineRef: {
        namespace: 'pipeline-namespace',
        name: 'pipeline-name',
      },
      loadPatterns: [
        {
          endpointName: 'endpoint-name',
          loadPatternRef: {
            namespace: 'loadPattern-namespace',
            name: 'loadPattern-name',
          },
        },
      ],
      scheduledTime: undefined,
    },
  });
});
