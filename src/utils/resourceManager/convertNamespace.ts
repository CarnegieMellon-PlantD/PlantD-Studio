import { NamespaceDTO, NamespaceVO } from '@/types/resourceManager/namespace';

/**
 * Convert the data transfer object of a namespace to the view object
 * @param dto The data transfer object of a namespace
 * @returns The view object of a namespace
 */
export const getNamespaceVO = (dto: NamespaceDTO): NamespaceVO => {
  return {
    name: dto.metadata.name,
  };
};

/**
 * Convert the view object of a namespace to the data transfer object
 * @param vo The view object of a namespace
 * @returns The data transfer object of a namespace
 */
export const getNamespaceDTO = (vo: NamespaceVO): Pick<NamespaceDTO, 'metadata'> => {
  return {
    metadata: {
      name: vo.name,
    },
  };
};
