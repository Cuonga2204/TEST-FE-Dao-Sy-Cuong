import { App, Button, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { SortOrder as AntdSortOrder } from 'antd/es/table/interface';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatDate } from '@/utils/formatDate';
import { PAGE_SIZE_OPTIONS } from '@/constant/pagination';
import {
  selectFilteredTasks,
  selectPaginatedTasks,
  selectPagination,
  selectSort,
} from '../slice/tasksSelectors';
import { deleteTask, setPage, setSort } from '../slice/tasksSlice';
import InlineStatusSelect from '@/components/InlineStatusSelect';
import PriorityTag from '@/components/PriorityTag';
import type { SortField, Task } from '@/types/task';

interface Props {
  onEdit: (task: Task) => void;
  selectedRowKeys: React.Key[];
  onSelectionChange: (keys: React.Key[]) => void;
}

export default function TasksTable({ onEdit, selectedRowKeys, onSelectionChange }: Props) {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const data = useAppSelector(selectPaginatedTasks);
  const total = useAppSelector(selectFilteredTasks).length;
  const pagination = useAppSelector(selectPagination);
  const sort = useAppSelector(selectSort);

  const orderOf = (field: SortField): AntdSortOrder => {
    if (!sort || sort.field !== field) return null;
    return sort.order === 'asc' ? 'ascend' : 'descend';
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      sortOrder: orderOf('title'),
      ellipsis: true,
      render: (v: string) => <span className="font-medium">{v}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (_, r) => <InlineStatusSelect taskId={r.id} status={r.status} />,
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 130,
      sorter: true,
      sortOrder: orderOf('priority'),
      render: (_, r) => <PriorityTag priority={r.priority} />,
    },
    {
      title: 'Người được giao',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 170,
      render: (v?: string) => v ?? <span className="text-neutral-400">—</span>,
    },
    {
      title: 'Hạn chót',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 130,
      sorter: true,
      sortOrder: orderOf('dueDate'),
      render: (v?: string) =>
        v ? formatDate(v) : <span className="text-neutral-400">—</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      align: 'center',
      render: (_, r) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(r)}
            aria-label="Chỉnh sửa"
          />
          <Popconfirm
            title="Xoá task này?"
            description="Hành động không thể hoàn tác."
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              dispatch(deleteTask(r.id));
              message.success('Đã xoá task');
            }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Xoá"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleChange: TableProps<Task>['onChange'] = (paginationArg, _filters, sorter) => {
    const single = Array.isArray(sorter) ? sorter[0] : sorter;
    if (single?.field && single.order) {
      dispatch(
        setSort({
          field: single.field as SortField,
          order: single.order === 'ascend' ? 'asc' : 'desc',
        }),
      );
    } else {
      dispatch(setSort(null));
    }

    if (paginationArg.current && paginationArg.pageSize) {
      dispatch(
        setPage({
          currentPage: paginationArg.current,
          pageSize: paginationArg.pageSize,
        }),
      );
    }
  };

  return (
    <Table<Task>
      rowKey="id"
      dataSource={data}
      columns={columns}
      onChange={handleChange}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectionChange,
      }}
      pagination={{
        current: pagination.currentPage,
        pageSize: pagination.pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        showTotal: (t, [from, to]) => `${from}-${to} / ${t} task`,
      }}
      scroll={{ x: 960 }}
      locale={{ emptyText: 'Không tìm thấy task phù hợp' }}
    />
  );
}
