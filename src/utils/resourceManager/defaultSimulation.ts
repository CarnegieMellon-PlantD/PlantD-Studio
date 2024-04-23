import { SimulationVO } from '@/types/resourceManager/simulation';

export const getDefaultSimulation = (namespace: string): SimulationVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  digitalTwinRef: { namespace: '', name: '' },
  trafficModelRef: { namespace: '', name: '' },
  netCostRef: { namespace: '', name: '' },
  scenarioRef: { namespace: '', name: '' },
});
