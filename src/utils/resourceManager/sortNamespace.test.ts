import { expect, test } from '@jest/globals';

import { sortNamespace } from './sortNamespace';

test('Normal comparison', () => {
  expect(sortNamespace('a', 'b')).toStrictEqual(-1);
  expect(sortNamespace('a', 'aa')).toStrictEqual(-1);
  expect(sortNamespace('a', 'a')).toStrictEqual(0);
  expect(sortNamespace('b', 'a')).toStrictEqual(1);
  expect(sortNamespace('aa', 'a')).toStrictEqual(1);
});

test('Default namespace comparison', () => {
  expect(sortNamespace('default', 'a')).toStrictEqual(-1);
  expect(sortNamespace('default', 'default')).toStrictEqual(0);
  expect(sortNamespace('a', 'default')).toStrictEqual(1);
});
