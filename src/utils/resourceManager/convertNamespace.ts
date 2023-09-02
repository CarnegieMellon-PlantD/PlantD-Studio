import { NamespaceDTO, NamespaceVO } from '@/types/resourceManager/namespace';

/**
 * Convert the data transfer object of a namespace to the view object
 * @param namespaceDTO The data transfer object of a namespace
 * @returns The view object of a namespace
 */
export const getNamespaceVO = (namespaceDTO: NamespaceDTO): NamespaceVO => {
  return {
    name: namespaceDTO.metadata.name,
  };
};

/**
 * Convert the view object of a namespace to the data transfer object
 * @param namespaceVO The view object of a namespace
 * @returns The data transfer object of a namespace
 */
export const getNamespaceDTO = (namespaceVO: NamespaceVO): Pick<NamespaceDTO, 'metadata'> => {
  return {
    metadata: {
      name: namespaceVO.name,
    },
  };
};
