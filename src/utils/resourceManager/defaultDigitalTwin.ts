import { DigitalTwinVO } from '@/types/resourceManager/digitalTwin';

export const getDefaultDigitalTwin = (namespace: string): DigitalTwinVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  modelType: '',
  digitalTwinType: 'regular',
  experiments: [],
  dataSet: {
    name: '',
  },
  pipeline: {
    name: '',
  },
  pipelineCapacity: 0,
});

export const getDefaultDigitalTwinExperiment = (namespace: string): DigitalTwinVO['experiments'][number] => ({
  namespace,
  name: '',
});
