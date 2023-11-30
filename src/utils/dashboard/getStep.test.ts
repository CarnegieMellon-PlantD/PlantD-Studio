import { expect, test } from '@jest/globals';

import { getStep } from './getStep';

test('Happy cases', () => {
  expect(getStep(0, 10, 2)).toStrictEqual(10);
  expect(getStep(0, 10, 11)).toStrictEqual(1);
  expect(getStep(0, 10, 100)).toStrictEqual(1);
});
