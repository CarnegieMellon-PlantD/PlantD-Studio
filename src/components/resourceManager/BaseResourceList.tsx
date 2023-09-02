import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { faAdd, faClone, faPen, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { MutationDefinition } from '@reduxjs/toolkit/query';
import { App, Breadcrumb, Button, Card, Form, Modal, Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useUpdateEffect } from 'usehooks-ts';

import BaseResourceSelect from '@/components/resourceManager/BaseResourceSelect';
import { appName } from '@/constants/base';
import { formStyle } from '@/constants/formStyles';
import { AxiosBaseQueryFn } from '@/services/baseApi';
import { useListNamespacesQuery } from '@/services/resourceManager/namespaceApi';
import { updateCurrentNamespace } from '@/slices/appState';
import { AppDispatch, RootState } from '@/store';
import { concatInPath } from '@/utils/concatInPath';
import { getErrMsg } from '@/utils/getErrMsg';

interface BaseResourceListProps<DTO_R, DTO_L> extends Omit<TableProps<DTO_R>, 'loading' | 'dataSource' | 'rowKey'> {
  /** Show Namespace select */
  showNamespaceSelect?: boolean;
  /** Allow clone */
  allowClone?: boolean | ((record: DTO_R) => boolean);
  /** Allow edit */
  allowEdit?: boolean | ((record: DTO_R) => boolean);
  /** Allow delete */
  allowDelete?: boolean | ((record: DTO_R) => boolean);
  /** Resource kind */
  resourceKind: string;
  /** Resource kind in URL for react-router-dom */
  resourceKindUrl: string;
  /** List of resources */
  data: DTO_R[] | undefined;
  /** Is resource list loading for the first time */
  isLoading: boolean;
  /** Is resource list fetching, previous data may exist */
  isFetching: boolean;
  /** Callback to refetch resource list */
  refetch: () => void;
  /** Hook for deleting resource */
  deleteHook: UseMutation<MutationDefinition<DTO_L, AxiosBaseQueryFn, string, void>>;
}

const BaseResourceList = <
  DTO_R extends { metadata: { namespace?: string; name: string }; spec: unknown; status: unknown },
  DTO_L extends { metadata: { namespace?: string; name: string } },
>({
  showNamespaceSelect = false,
  allowClone = false,
  allowEdit = false,
  allowDelete = true,
  resourceKind,
  resourceKindUrl,
  data,
  isLoading,
  isFetching,
  refetch,
  deleteHook,
  columns = [],
  ...props
}: BaseResourceListProps<DTO_R, DTO_L>) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['resourceList', 'common']);
  const { message } = App.useApp();

  const currentNamespace = useSelector((state: RootState) => state.appState.currentNamespace);
  const dispatch: AppDispatch = useDispatch();

  // Whether delete modal is shown
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Metadata of resource to delete, if any, otherwise `undefined`
  const [resourceToDelete, setResourceToDelete] = useState<DTO_L>();

  const [
    deleteResource,
    {
      isLoading: isDeleting,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
      error: deleteError,
      reset: resetDelete,
    },
  ] = deleteHook();

  // Filtered data
  const filteredData = useMemo(
    () =>
      data === undefined
        ? []
        : !showNamespaceSelect
        ? data
        : data.filter((item) => currentNamespace === undefined || item.metadata.namespace === currentNamespace),
    [data, showNamespaceSelect, currentNamespace]
  );

  // Show success message if resource is deleted successfully
  useUpdateEffect(() => {
    if (isDeleteSuccess) {
      message.success(t('deleteSuccessMsg', { kind: resourceKind }));
      // Hide delete modal
      setShowDeleteModal(false);
      setResourceToDelete(undefined);
      // Reset mutation
      resetDelete();
    }
  }, [isDeleteSuccess]);

  // Show error message if failed to delete resource
  useUpdateEffect(() => {
    if (isDeleteError && deleteError !== undefined) {
      message.error(t('deleteErrorMsg', { kind: resourceKind, error: getErrMsg(deleteError) }));
    }
  }, [isDeleteError, deleteError]);

  const columnsWithActions = useMemo<ColumnsType<DTO_R>>(
    () => [
      ...columns,
      {
        title: t('actionsCol'),
        render: (text, record) => (
          <div className="flex">
            {allowClone !== false && (
              <Button
                type="text"
                size="small"
                disabled={typeof allowClone === 'function' ? !allowClone(record) : !allowClone}
                icon={<FontAwesomeIcon icon={faClone} />}
                onClick={() => {
                  // Go to clone page
                  navigate(
                    `/${resourceKindUrl}/clone/${concatInPath(record.metadata.namespace, record.metadata.name)}`
                  );
                }}
              >
                {t('cloneBtn')}
              </Button>
            )}
            {allowEdit !== false && (
              <Button
                type="text"
                size="small"
                disabled={typeof allowEdit === 'function' ? !allowEdit(record) : !allowEdit}
                icon={<FontAwesomeIcon icon={faPen} />}
                onClick={() => {
                  // Go to edit page
                  navigate(`/${resourceKindUrl}/edit/${concatInPath(record.metadata.namespace, record.metadata.name)}`);
                }}
              >
                {t('editBtn')}
              </Button>
            )}
            {allowDelete !== false && (
              <Button
                type="text"
                size="small"
                disabled={typeof allowDelete === 'function' ? !allowDelete(record) : !allowDelete}
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={() => {
                  // Show delete modal
                  setShowDeleteModal(true);
                  setResourceToDelete({
                    metadata: record.metadata,
                  } as DTO_L);
                }}
              >
                {t('deleteBtn')}
              </Button>
            )}
          </div>
        ),
        width:
          // Column horizontal padding is 8px
          2 * 8 +
          (allowClone !== false ? 79 : 0) +
          (allowEdit !== false ? 67 : 0) +
          (allowDelete !== false ? 83 : 0) +
          // Extra space
          50,
      },
    ],
    [columns, allowClone, allowEdit, allowDelete, resourceKindUrl, navigate, t]
  );

  return (
    <div className="p-6">
      <Breadcrumb
        items={[{ title: appName }, { title: t('common:resources') }, { title: resourceKind }]}
        className="mb-6"
      />
      {showNamespaceSelect && (
        <Card bordered={false} className="mb-6">
          <Form {...formStyle}>
            <Form.Item className="mb-0" label={t('currentNamespaceLabel')}>
              <BaseResourceSelect
                resourceKindPlural={t('common:namespacePlural')}
                listHook={useListNamespacesQuery}
                placeholder={t('currentNamespacePlaceholder')}
                allowClear
                value={currentNamespace}
                onChange={(value) => {
                  dispatch(updateCurrentNamespace(value));
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      )}
      <Card bordered={false}>
        <div className="mb-4 flex gap-2">
          <Button
            type="primary"
            icon={<FontAwesomeIcon icon={faAdd} />}
            onClick={() => {
              // Go to editor page
              navigate(`/${resourceKindUrl}/create`);
            }}
          >
            {t('createBtn')}
          </Button>
          <Button
            icon={<FontAwesomeIcon icon={faRefresh} />}
            loading={isFetching}
            onClick={() => {
              refetch();
            }}
          >
            {t('refreshBtn')}
          </Button>
        </div>
        <Table
          size="middle"
          loading={isLoading}
          dataSource={filteredData}
          rowKey={(record) => concatInPath(record.metadata.namespace, record.metadata.name)}
          columns={columnsWithActions}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          {...props}
        />
        <Modal
          title={t('deleteModalTitle', { kind: resourceKind })}
          open={showDeleteModal}
          confirmLoading={isDeleting}
          closable={false}
          // Destroy modal when closed to reset styles and avoid left padding on confirm button
          destroyOnClose
          okButtonProps={{ danger: true }}
          okText={t('common:okBtn')}
          cancelText={t('common:cancelBtn')}
          onCancel={() => {
            // Hide delete modal
            setShowDeleteModal(false);
            setResourceToDelete(undefined);
          }}
          onOk={() => {
            if (resourceToDelete) {
              deleteResource(resourceToDelete);
            }
          }}
        >
          <span>
            {t('deleteModalContent', {
              kind: resourceKind,
              name: concatInPath(resourceToDelete?.metadata.namespace, resourceToDelete?.metadata.name ?? ''),
            })}
          </span>
        </Modal>
      </Card>
    </div>
  );
};

export default BaseResourceList;
