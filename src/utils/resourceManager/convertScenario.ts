import { ScenarioDTO, ScenarioVO } from '@/types/resourceManager/scenario';

/**
 * Convert the data transfer object of a Scenario to the view object
 * @param scenarioDTO The data transfer object of a Scenario
 * @returns The view object of a Scenario
 */
export const getScenarioVO = (scenarioDTO: ScenarioDTO): ScenarioVO => {
  return {
    namespace: scenarioDTO.metadata.namespace,
    name: scenarioDTO.metadata.name,
    dataSetConfig: scenarioDTO.spec.dataSetConfig,
    pipelineRef: scenarioDTO.spec.pipelineRef,
    tasks: scenarioDTO.spec.tasks,
  };
};

/**
 * Convert the view object of a Scenario to the data transfer object
 * @param scenarioVO The view object of a Scenario
 * @returns The data transfer object of a Scenario
 */
export const getScenarioDTO = (scenarioVO: ScenarioVO): Pick<ScenarioDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: scenarioVO.namespace,
      name: scenarioVO.name,
    },
    spec: {
      dataSetConfig: scenarioVO.dataSetConfig,
      pipelineRef: scenarioVO.pipelineRef,
      tasks: scenarioVO.tasks,
    },
  };
};
