import { nanoid } from '@reduxjs/toolkit';

import { LoadPatternDTO, LoadPatternVO } from '@/types/resourceManager/loadPattern';

/**
 * Convert the data transfer object of a LoadPattern to the view object
 * @param dto The data transfer object of a LoadPattern
 * @returns The view object of a LoadPattern
 */
export const getLoadPatternVO = (dto: LoadPatternDTO): LoadPatternVO => {
  let restStages: LoadPatternVO['stages'] = [];
  if (dto.spec.stages !== undefined) {
    restStages = dto.spec.stages.map((stage) => ({
      id: nanoid(),
      target: stage.target ?? 0,
      duration: stage.duration ?? '',
    }));
  }

  return {
    originalObject: dto.spec,
    namespace: dto.metadata.namespace,
    name: dto.metadata.name,
    stages: [
      {
        id: nanoid(),
        target: dto.spec.startRate ?? 0,
        duration: '',
      },
      ...restStages,
    ],
  };
};

/**
 * Convert the view object of a LoadPattern to the data transfer object
 * @param vo The view object of a LoadPattern
 * @returns The data transfer object of a LoadPattern
 */
export const getLoadPatternDTO = (vo: LoadPatternVO): Pick<LoadPatternDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: vo.namespace,
      name: vo.name,
    },
    spec: {
      ...vo.originalObject,
      stages: vo.stages.slice(1).map((stage) => ({
        target: stage.target,
        duration: stage.duration,
      })),
      preAllocatedVUs: 30,
      startRate: vo.stages[0].target,
      maxVUs: Math.max(100, ...vo.stages.map((stage) => stage.target)),
      timeUnit: '1s',
    },
  };
};
