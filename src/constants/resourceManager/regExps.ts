export const rfc1123RegExp = /^[a-z0-9](?:[a-z0-9.-]{0,61}[a-z0-9])?$/;
export const namespaceNoReservedKeywordRegExp = /^(?!(?:.+[.-])?(?:kube|system|manager|controller)(?:[.-].+)?$).*$/;
export const durationRegExp = /^((\d+)(s|m|h|d|w|y))+$/;
export const sizeRegExp = /^(\d+)(Ki|Mi|Gi|Ti|Pi|Ei)$/;
