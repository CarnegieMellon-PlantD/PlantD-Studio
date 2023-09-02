import { expect, test } from '@jest/globals';

import { getClsName } from './getClsName';

test('Empty input', () => {
  // Empty input should yield empty output
  expect(getClsName()).toStrictEqual('');
});

test('Input with falsy values', () => {
  // Falsy values should be ignored
  expect(getClsName('a', 'b', '', 'c', false, 'd', null, 'e', undefined)).toStrictEqual('a b c d e');
});
