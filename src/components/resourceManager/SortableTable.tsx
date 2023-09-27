import * as React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuOutlined } from '@ant-design/icons';
import { DndContext, UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

type RowKey = UniqueIdentifier;

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Row key provided by Antd */
  'data-row-key': RowKey;
}

const Row: React.FC<RowProps> = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    // Use the row key as unique identifier for dnd-kit
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
      /translate3d\(([^,]+),/,
      'translate3d(0,'
    ),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
  };

  return (
    <tr {...props} {...attributes} ref={setNodeRef} style={style}>
      {React.Children.map(children, (child) => {
        // Render the drag handle if `key` of the column is `sort`
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: <MenuOutlined className="touch-none cursor-move" ref={setActivatorNodeRef} {...listeners} />,
          });
        }
        return child;
      })}
    </tr>
  );
};

interface SortableTableProps<T> extends Omit<TableProps<T>, 'size' | 'components' | 'pagination'> {
  /**
   * Callback when drag ends
   * @param activeRowKey Row key of the row being dragged
   * @param overRowKey Row key of the row being dragged over
   */
  onDragEnd: (activeRowKey: RowKey, overRowKey: RowKey) => void;
  /** Callback to create new row */
  onCreateRow: () => void;
  /**
   * Callback to delete row
   * @param rowKey Row key of the row being deleted
   */
  onDeleteRow: (rowKey: RowKey) => void;
}

const SortableTable = <T extends object>({
  onDragEnd,
  onCreateRow,
  onDeleteRow,
  dataSource = [],
  rowKey = 'key',
  columns = [],
  ...props
}: SortableTableProps<T>) => {
  const { t } = useTranslation(['resourceEditor']);

  const columnsWithHandle = useMemo<ColumnsType<T>>(
    () => [
      // Render the drag handle
      {
        key: 'sort',
        width: 50,
      },
      ...columns,
      // Render the delete button
      {
        key: 'delete',
        render: (text, record) => (
          <Button
            type="text"
            size="small"
            icon={
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => {
                  // Assume the `rowKey` is a key of `T`, let error be thrown if it is not
                  onDeleteRow(
                    typeof rowKey === 'function' ? (rowKey(record) as RowKey) : (record[rowKey as keyof T] as RowKey)
                  );
                }}
              />
            }
          />
        ),
        width: 50,
      },
    ],
    [columns, onDeleteRow, rowKey]
  );

  return (
    <>
      <Button
        className="mb-4"
        type="primary"
        icon={<FontAwesomeIcon icon={faAdd} />}
        onClick={() => {
          onCreateRow();
        }}
      >
        {t('addBtn')}
      </Button>
      <DndContext
        onDragEnd={({ active, over }) => {
          if (over !== null && active.id !== over.id) {
            onDragEnd(active.id, over.id);
          }
        }}
      >
        <SortableContext
          // Use the row keys as unique identifiers for dnd-kit
          // Assume the `rowKey` is a key of `T`, let error be thrown if it is not
          items={dataSource.map((item) =>
            typeof rowKey === 'function' ? (rowKey(item) as RowKey) : (item[rowKey as keyof T] as RowKey)
          )}
          strategy={verticalListSortingStrategy}
        >
          <Table<T>
            size="middle"
            components={{
              body: {
                row: Row,
              },
            }}
            // Specify the row key so that Antd will pass it to rows as `data-row-key` in props
            rowKey={rowKey}
            columns={columnsWithHandle}
            dataSource={dataSource}
            pagination={false}
            {...props}
          />
        </SortableContext>
      </DndContext>
    </>
  );
};

export default SortableTable;
