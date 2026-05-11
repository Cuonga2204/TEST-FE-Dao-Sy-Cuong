import { useCallback, useState } from 'react';
import { App, Button, Card, Flex, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store/hooks';
import { deleteManyTasks } from '@/features/tasks/slice/tasksSlice';
import FilterBar from '@/features/tasks/components/FilterBar';
import TaskFormModal from '@/features/tasks/components/TaskFormModal';
import TasksTable from '@/features/tasks/components/TasksTable';
import { useTaskUrlSync } from '@/hook/useTaskUrlSync';
import type { Task } from '@/types/task';

const { Title } = Typography;

export default function TasksPage() {
  useTaskUrlSync();
  const dispatch = useAppDispatch();
  const { message, modal } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const openAdd = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleBulkDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) return;
    modal.confirm({
      title: `Xoá ${selectedRowKeys.length} task đã chọn?`,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => {
        dispatch(deleteManyTasks(selectedRowKeys.map(String)));
        message.success(`Đã xoá ${selectedRowKeys.length} task`);
        setSelectedRowKeys([]);
      },
    });
  }, [selectedRowKeys, dispatch, modal, message]);

  return (
    <Flex vertical gap="middle">
      <Flex wrap="wrap" align="center" justify="space-between" gap="small">
        <Title level={3} className="!mb-0">
          Tasks
        </Title>
        <Space wrap>
          {selectedRowKeys.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBulkDelete}>
              Xoá đã chọn ({selectedRowKeys.length})
            </Button>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      <Card styles={{ body: { padding: 16 } }}>
        <FilterBar />
      </Card>

      <Card styles={{ body: { padding: 0 } }}>
        <TasksTable
          onEdit={openEdit}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
        />
      </Card>

      <TaskFormModal open={modalOpen} task={editingTask} onClose={closeModal} />
    </Flex>
  );
}
