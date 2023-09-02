/**
 * Concatenates the given nodes into a path
 * @param nodes The nodes to be concatenated
 * @returns The concatenated path
 */
export const concatInPath = (...nodes: Array<string | undefined>) => {
  return nodes.filter(Boolean).join('/');
};
