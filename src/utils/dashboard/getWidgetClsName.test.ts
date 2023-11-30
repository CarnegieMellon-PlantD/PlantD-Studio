import { expect, test } from '@jest/globals';

import { getWidgetClsName } from './getWidgetClsName';

test('Happy case', () => {
  for (let w = 1; w <= 2; w++) {
    for (let h = 1; h <= 6; h++) {
      expect(getWidgetClsName(w as never, h as never)).toStrictEqual(`col-span-${w} row-span-${h}`);
    }
  }
  for (let w = 3; w <= 6; w++) {
    for (let h = 1; h <= 6; h++) {
      expect(getWidgetClsName(w as never, h as never)).toStrictEqual(`col-span-2 lg:col-span-${w} row-span-${h}`);
    }
  }
});

test('Unhappy case', () => {
  expect(getWidgetClsName(0 as never, 0 as never)).toStrictEqual('col-span-1 row-span-1');
});
