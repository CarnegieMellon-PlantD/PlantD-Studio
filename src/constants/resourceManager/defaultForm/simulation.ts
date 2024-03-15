import { SimulationVO } from '@/types/resourceManager/simulation';

export const getDefaultSimulationForm = (namespace: string): SimulationVO => ({
  namespace: namespace,
  name: '',
  digitalTwinRef: { namespace: '', name: '' },
  trafficModelRef: { namespace: '', name: '' },
});
