import { nanoid } from '@reduxjs/toolkit';

import { LoadPatternVO } from '@/types/resourceManager/loadPattern';

export const getDefaultLoadPatternForm = (namespace: string): LoadPatternVO => ({
  namespace: namespace,
  name: '',
  stages: [
    {
      id: nanoid(),
      target: 0,
      duration: 0,
      durationUnit: '',
    },
  ],
});
