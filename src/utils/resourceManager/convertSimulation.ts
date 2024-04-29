import { SimulationDTO, SimulationVO } from '@/types/resourceManager/simulation';

/**
 * Convert the data transfer object of a Simulation to the view object
 * @param dto The data transfer object of a Simulation
 * @returns The view object of a Simulation
 */
export const getSimulationVO = (dto: SimulationDTO): SimulationVO => {
  return {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    hasDigitalTwin:
      dto.spec.digitalTwinRef?.namespace !== undefined &&
      dto.spec.digitalTwinRef?.name !== undefined &&
      dto.spec.digitalTwinRef.namespace !== '' &&
      dto.spec.digitalTwinRef.name !== '',
    digitalTwinRef: {
      namespace: dto.spec.digitalTwinRef?.namespace ?? '',
      name: dto.spec.digitalTwinRef?.name ?? '',
    },
    trafficModelRef: {
      namespace: dto.spec.trafficModelRef?.namespace ?? '',
      name: dto.spec.trafficModelRef?.name ?? '',
    },
    hasNetCost:
      dto.spec.netCostRef?.namespace !== undefined &&
      dto.spec.netCostRef?.name !== undefined &&
      dto.spec.netCostRef.namespace !== '' &&
      dto.spec.netCostRef.name !== '',
    netCostRef: {
      namespace: dto.spec.netCostRef?.namespace ?? '',
      name: dto.spec.netCostRef?.name ?? '',
    },
    scenarioRef: {
      namespace: dto.spec.scenarioRef?.namespace ?? '',
      name: dto.spec.scenarioRef?.name ?? '',
    },
  };
};

/**
 * Convert the view object of a Simulation to the data transfer object
 * @param vo The view object of a Simulation
 * @returns The data transfer object of a Simulation
 */
export const getSimulationDTO = (vo: SimulationVO): Pick<SimulationDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      digitalTwinRef: vo.hasDigitalTwin ? vo.digitalTwinRef : undefined,
      trafficModelRef: vo.trafficModelRef,
      netCostRef: vo.hasNetCost ? vo.netCostRef : undefined,
      scenarioRef: vo.scenarioRef,
    },
  };
};
