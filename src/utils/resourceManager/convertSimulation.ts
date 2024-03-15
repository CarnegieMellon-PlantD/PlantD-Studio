import { SimulationDTO, SimulationVO } from '@/types/resourceManager/simulation';

/**
 * Convert the data transfer object of a Simulation to the view object
 * @param simulationDTO The data transfer object of a Simulation
 * @returns The view object of a Simulation
 */
export const getSimulationVO = (simulationDTO: SimulationDTO): SimulationVO => {
  return {
    namespace: simulationDTO.metadata.namespace,
    name: simulationDTO.metadata.name,
    digitalTwinRef: {
      namespace: simulationDTO.spec.digitalTwinRef?.namespace ?? '',
      name: simulationDTO.spec.digitalTwinRef?.name ?? '',
    },
    trafficModelRef: {
      namespace: simulationDTO.spec.trafficModelRef?.namespace ?? '',
      name: simulationDTO.spec.trafficModelRef?.name ?? '',
    },
  };
};

/**
 * Convert the view object of a Simulation to the data transfer object
 * @param simulationVO The view object of a Simulation
 * @returns The data transfer object of a Simulation
 */
export const getSimulationDTO = (simulationVO: SimulationVO): Pick<SimulationDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: simulationVO.namespace,
      name: simulationVO.name,
    },
    spec: {
      digitalTwinRef: simulationVO.digitalTwinRef,
      trafficModelRef: simulationVO.trafficModelRef,
    },
  };
};
