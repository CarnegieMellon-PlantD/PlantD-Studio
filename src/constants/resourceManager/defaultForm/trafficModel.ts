import { TrafficModelVO } from '@/types/resourceManager/trafficModel';

export const getDefaultTrafficModelForm = (namespace: string): TrafficModelVO => ({
  namespace: namespace,
  name: '',
  config: '',
});
