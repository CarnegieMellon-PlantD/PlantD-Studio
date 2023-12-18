import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UseLazyQuery, UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { MutationDefinition, QueryDefinition } from '@reduxjs/toolkit/query';
import { App, Breadcrumb, Form, FormInstance } from 'antd';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

import { defaultNamespace } from '@/constants/resourceManager';
import { AxiosBaseQueryFn } from '@/services/baseApi';
import { RootState } from '@/store';
import { getErrMsg } from '@/utils/getErrMsg';

type UseResourceEditorOptions<VO, DTO_R, DTO_W, DTO_L> = {
  /** Resource kind */
  resourceKind: string;
  /** Callback to get default form data */
  getDefaultForm: (namespace: string) => VO;
  /** Hook for lazy get query */
  lazyGetHook: UseLazyQuery<QueryDefinition<DTO_L, AxiosBaseQueryFn, string, DTO_R>> | null;
  /** Hook for create mutation */
  createHook: UseMutation<MutationDefinition<DTO_W, AxiosBaseQueryFn, string, void>>;
  /** Hook for update mutation */
  updateHook: UseMutation<MutationDefinition<DTO_W, AxiosBaseQueryFn, string, void>> | null;
  /** Converter from DTO to VO */
  getVO: (dto: DTO_R) => VO;
  /** Converter from VO to DTO */
  getDTO: (vo: VO) => DTO_W;
};

type UseResourceEditorResults<VO> = {
  /** Breadcrumb */
  breadcrumb: React.ReactElement;
  /** Form instance */
  form: FormInstance<VO>;
  /** Callback to create or update resource */
  createOrUpdateResource: () => void;
  /** Is getting, creating or updating resource */
  isLoading: boolean;
  /** Is creating or updating resource */
  isCreatingOrUpdating: boolean;
};

class InvalidURLParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidURLParamsError';
  }
}

export const useResourceEditor = <VO, DTO_R, DTO_W, DTO_L>({
  resourceKind,
  getDefaultForm,
  lazyGetHook,
  createHook,
  updateHook,
  getVO,
  getDTO,
}: UseResourceEditorOptions<VO, DTO_R, DTO_W, DTO_L>): UseResourceEditorResults<VO> => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentNamespace = useSelector((state: RootState) => state.appState.currentNamespace);

  const { message } = App.useApp();
  const [form] = Form.useForm<VO>();

  const [getResource, { data, isLoading: isGetting, isSuccess: isGetSuccess, isError: isGetError, error: getError }] =
    lazyGetHook?.() ?? [() => undefined, { isLoading: false, isSuccess: false, isError: false }];
  const [
    createResource,
    {
      isLoading: isCreating,
      isSuccess: isCreateSuccess,
      isError: isCreateError,
      error: createError,
      reset: resetCreate,
    },
  ] = createHook();
  const [
    updateResource,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
      reset: resetUpdate,
    },
  ] = updateHook?.() ?? [
    () => undefined,
    {
      isLoading: false,
      isSuccess: false,
      isError: false,
      reset: () => undefined,
    },
  ];

  // Validate `params`
  const allowCreateOnly = useMemo(() => lazyGetHook == null || updateHook == null, [lazyGetHook, updateHook]);
  const isParamsValid = useMemo(
    () => params.namespace !== undefined && params.name !== undefined,
    [params.namespace, params.name]
  );
  const isCreateMode = useMemo(() => params.action === 'create', [params.action]);
  const isCloneMode = useMemo(
    () => !allowCreateOnly && params.action === 'clone' && isParamsValid,
    [params.action, allowCreateOnly, isParamsValid]
  );
  const isEditMode = useMemo(
    () => !allowCreateOnly && params.action === 'edit' && isParamsValid,
    [params.action, allowCreateOnly, isParamsValid]
  );
  if (!isCreateMode && !isCloneMode && !isEditMode) {
    // Throw error to trigger error page
    throw new InvalidURLParamsError(t('Error: Invalid URL {url}', { url: location.pathname }));
  }

  // Apply default form data in `create` mode
  useEffectOnce(() => {
    if (isCreateMode) {
      form.setFieldsValue(getDefaultForm(currentNamespace ?? defaultNamespace) as never);
    }
  });

  // Get resource in `clone` or `edit` modes
  useEffectOnce(() => {
    if (isCloneMode || isEditMode) {
      getResource({
        metadata: {
          namespace: params.namespace,
          name: params.name,
        },
      } as DTO_L);
    }
  });

  // Update form data when the resource is got successfully
  useUpdateEffect(() => {
    if (isGetSuccess && data !== undefined) {
      form.setFieldsValue(getVO(data) as never);
    }
  }, [isGetSuccess, data]);

  // Show error message if failed to get the resource
  useUpdateEffect(() => {
    if (isGetError && getError !== undefined) {
      message.error(t('Failed to get {kind} resource: {error}', { kind: resourceKind, error: getErrMsg(getError) }));
    }
  }, [isGetError, getError]);

  // Show success message if resource is created successfully
  useUpdateEffect(() => {
    if (isCreateSuccess) {
      message.success(t('Created {kind} resource successfully', { kind: resourceKind }));
      // Reset mutation
      resetCreate();
      // Go back
      navigate(-1);
    }
  }, [isCreateSuccess]);

  // Show error message if failed to create resource
  useUpdateEffect(() => {
    if (isCreateError && createError !== undefined) {
      message.error(
        t('Failed to create {kind} resource: {error}', { kind: resourceKind, error: getErrMsg(createError) })
      );
    }
  }, [isCreateError, createError]);

  // Show success message if resource is updated successfully
  useUpdateEffect(() => {
    if (isUpdateSuccess) {
      message.success(t('Updated {kind} resource successfully', { kind: resourceKind }));
      // Reset mutation
      resetUpdate();
      // Go back
      navigate(-1);
    }
  }, [isUpdateSuccess]);

  // Show error message if failed to update resource
  useUpdateEffect(() => {
    if (isUpdateError && updateError !== undefined) {
      message.error(
        t('Failed to update {kind} resource: {error}', { kind: resourceKind, error: getErrMsg(updateError) })
      );
    }
  }, [isUpdateError, updateError]);

  const createOrUpdateResource = () => {
    if (isCreateMode || isCloneMode) {
      createResource(getDTO(form.getFieldsValue(true) as VO));
    } else if (isEditMode) {
      updateResource(getDTO(form.getFieldsValue(true) as VO));
    }
  };

  const breadcrumb = (
    <Breadcrumb
      items={[
        { title: t('PlantD Studio') },
        { title: t('Resources') },
        { title: resourceKind },
        {
          title: isCreateMode
            ? // isCreateMode
              t('Create')
            : isCloneMode
            ? // isCloneMode
              t('Clone: {target}', { target: `${params.namespace}/${params.name}` })
            : // isEditMode
              t('Edit: {target}', { target: `${params.namespace}/${params.name}` }),
        },
      ]}
    />
  );

  return {
    breadcrumb,
    form,
    createOrUpdateResource,
    isLoading: isGetting || isCreating || isUpdating,
    isCreatingOrUpdating: isCreating || isUpdating,
  };
};
