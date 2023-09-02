import { defaultNamespace } from '@/constants/base';

/**
 * Sort the Namespaces
 * @param a Namespace
 * @param b Namespace
 * @returns `-1` if `a` is less than `b`, `0` if `a` equals `b`, `1` if `a` is greater than `b`
 */
export const sortNamespace = (a: string, b: string): number => {
  if (a === defaultNamespace && b === defaultNamespace) {
    return 0;
  }
  if (a === defaultNamespace) {
    return -1;
  }
  if (b === defaultNamespace) {
    return 1;
  }
  return a < b ? -1 : a === b ? 0 : 1;
};
