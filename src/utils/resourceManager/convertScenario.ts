import { nanoid } from '@reduxjs/toolkit';

import { ScenarioDTO, ScenarioVO } from '@/types/resourceManager/scenario';

/**
 * Convert the data transfer object of a Scenario to the view object
 * @param dto The data transfer object of a Scenario
 * @returns The view object of a Scenario
 */
export const getScenarioVO = (dto: ScenarioDTO): ScenarioVO => {
  const vo: ScenarioVO = {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    tasks: [],
  };

  if (dto.spec.tasks !== undefined) {
    vo.tasks = dto.spec.tasks.map((task) => ({
      id: nanoid(),
      name: task.name ?? '',
      size: task.size ?? '',
      sendingDevices: {
        min: task.sendingDevices?.min ?? 0,
        max: task.sendingDevices?.max ?? 0,
      },
      pushFrequencyPerMonth: {
        min: task.pushFrequencyPerMonth?.min ?? 0,
        max: task.pushFrequencyPerMonth?.max ?? 0,
      },
      monthsRelevant: task.monthsRelevant ?? [],
    }));
  }

  return vo;
};

/**
 * Convert the view object of a Scenario to the data transfer object
 * @param vo The view object of a Scenario
 * @returns The data transfer object of a Scenario
 */
export const getScenarioDTO = (vo: ScenarioVO): Pick<ScenarioDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      tasks: vo.tasks.map(({ id, ...task }) => task),
    },
  };
};
