import { nanoid } from '@reduxjs/toolkit';

import { LoadPatternDTO, LoadPatternVO } from '@/types/resourceManager/loadPattern';

/**
 * Convert the data transfer object of a LoadPattern to the view object
 * @param loadPatternDTO The data transfer object of a LoadPattern
 * @returns The view object of a LoadPattern
 */
export const getLoadPatternVO = (loadPatternDTO: LoadPatternDTO): LoadPatternVO => {
  return {
    namespace: loadPatternDTO.metadata.namespace,
    name: loadPatternDTO.metadata.name,
    stages: [
      {
        id: nanoid(),
        target: loadPatternDTO.spec.startRate ?? 0,
        duration: 0,
        durationUnit: '',
      },
      ...(loadPatternDTO.spec.stages === undefined
        ? []
        : loadPatternDTO.spec.stages.map((stage) => ({
            id: nanoid(),
            target: stage.target ?? 0,
            duration: stage.duration === undefined ? 0 : Number.parseInt(stage.duration.slice(0, -1)),
            durationUnit: stage.duration?.slice(-1) ?? '',
          }))),
    ],
  };
};

/**
 * Convert the view object of a LoadPattern to the data transfer object
 * @param loadPatternVO The view object of a LoadPattern
 * @returns The data transfer object of a LoadPattern
 */
export const getLoadPatternDTO = (loadPatternVO: LoadPatternVO): Pick<LoadPatternDTO, 'metadata' | 'spec'> => {
  return {
    metadata: {
      namespace: loadPatternVO.namespace,
      name: loadPatternVO.name,
    },
    spec: {
      stages: loadPatternVO.stages.slice(1).map((stage) => ({
        target: stage.target,
        duration: `${stage.duration.toString()}${stage.durationUnit}`,
      })),
      preAllocatedVUs: 30,
      startRate: loadPatternVO.stages[0].target,
      maxVUs: 100,
      timeUnit: '1s',
    },
  };
};
