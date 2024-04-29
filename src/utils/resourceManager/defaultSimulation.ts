import { SimulationVO } from '@/types/resourceManager/simulation';

export const getDefaultSimulation = (namespace: string): SimulationVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  hasDigitalTwin: true,
  digitalTwinRef: { namespace: '', name: '' },
  trafficModelRef: { namespace: '', name: '' },
  hasNetCost: true,
  netCostRef: { namespace: '', name: '' },
  scenarioRef: { namespace: '', name: '' },
});
