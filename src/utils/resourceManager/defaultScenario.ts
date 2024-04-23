import { nanoid } from '@reduxjs/toolkit';

import { ScenarioVO } from '@/types/resourceManager/scenario';

export const getDefaultScenario = (namespace: string): ScenarioVO => ({
  originalObject: {},
  namespace: namespace,
  name: '',
  tasks: [],
});

export const getDefaultScenarioTask = (): ScenarioVO['tasks'][number] => ({
  id: nanoid(),
  name: '',
  size: '',
  sendingDevices: {
    min: 0,
    max: 0,
  },
  pushFrequencyPerMonth: {
    min: 0,
    max: 0,
  },
  monthsRelevant: [],
});
