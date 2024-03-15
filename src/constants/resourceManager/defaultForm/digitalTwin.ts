import { DigitalTwinVO } from '@/types/resourceManager/digitalTwin';

export const getDefaultDigitalTwinForm = (namespace: string): DigitalTwinVO => ({
  namespace: namespace,
  name: '',
  experiments: [],
  modelType: '',
});
