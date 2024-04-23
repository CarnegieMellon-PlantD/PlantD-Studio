import { TrafficModelVO } from '@/types/resourceManager/trafficModel';

export const getDefaultTrafficModel = (namespace: string): TrafficModelVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  config: '',
});
