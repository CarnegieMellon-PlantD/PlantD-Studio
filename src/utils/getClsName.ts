/**
 * Merge class names into one
 * @param clsNames Class names to be merged
 * @returns The merged class name
 */
export const getClsName = (...clsNames: Array<string | false | null | undefined>): string => {
  return clsNames.filter(Boolean).join(' ');
};
