import { expect, test } from '@jest/globals';

import { concatInPath } from './concatInPath';

test('Empty input', () => {
  // Empty input should yield empty output
  expect(concatInPath()).toStrictEqual('');
});

test('Input with falsy values', () => {
  // Falsy values should be ignored
  expect(concatInPath(undefined, 'a', undefined, 'b')).toStrictEqual('a/b');
});
