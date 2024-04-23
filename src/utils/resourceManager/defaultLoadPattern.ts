import { nanoid } from '@reduxjs/toolkit';

import { LoadPatternVO } from '@/types/resourceManager/loadPattern';

export const getDefaultLoadPattern = (namespace: string): LoadPatternVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  stages: [
    {
      id: nanoid(),
      target: 0,
      duration: '',
    },
  ],
});

export const getDefaultLoadPatternStage = (): LoadPatternVO['stages'][number] => ({
  id: nanoid(),
  target: 0,
  duration: '',
});
