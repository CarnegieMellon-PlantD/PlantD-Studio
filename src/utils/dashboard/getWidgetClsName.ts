export const getWidgetClsName = (width: 1 | 2 | 3 | 4 | 5 | 6, height: 1 | 2 | 3 | 4 | 5 | 6): string => {
  const widthClsName =
    width === 1
      ? 'col-span-1'
      : width === 2
      ? 'col-span-2'
      : width === 3
      ? 'col-span-2 lg:col-span-3'
      : width === 4
      ? 'col-span-2 lg:col-span-4'
      : width === 5
      ? 'col-span-2 lg:col-span-5'
      : width === 6
      ? 'col-span-2 lg:col-span-6'
      : 'col-span-1';
  const heightClsName =
    height === 1
      ? 'row-span-1'
      : height === 2
      ? 'row-span-2'
      : height === 3
      ? 'row-span-3'
      : height === 4
      ? 'row-span-4'
      : height === 5
      ? 'row-span-5'
      : height === 6
      ? 'row-span-6'
      : 'row-span-1';
  return `${widthClsName} ${heightClsName}`;
};
