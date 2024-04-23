import { ExperimentVO } from '@/types/resourceManager/experiment';

export const getDefaultExperiment = (namespace: string): ExperimentVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  pipelineRef: {
    name: '',
  },
  endpointSpecs: [],
  hasScheduledTime: false,
  scheduledTime: '',
  drainingMode: 'endDetection',
  drainingTime: '',
});

export const getDefaultExperimentEndpointSpec = (namespace: string): ExperimentVO['endpointSpecs'][number] => ({
  endpointName: '',
  dataSpec: {
    option: 'dataSet',
    plainText: '',
    dataSetRef: {
      name: '',
    },
  },
  loadPatternRef: {
    namespace,
    name: '',
  },
  storageSize: '',
});
