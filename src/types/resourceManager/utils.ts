/** Type definition of resource locator, which can locate a unique resource */
export type ResourceLocator = {
  kind: string;
  namespace: string;
  name: string;
};
