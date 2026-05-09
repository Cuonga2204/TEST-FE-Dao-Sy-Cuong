import {
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Statistic,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAppSelector } from "@/store/hooks";
import { formatDate } from "@/utils/formatDate";
import {
  selectRecentTasks,
  selectTaskStats,
} from "@/features/tasks/slice/tasksSelectors";
import StatusTag from "@/components/StatusTag";
import PriorityTag from "@/components/PriorityTag";
import type { Task } from "@/types/task";
import { STATUS_STAT_COLOR } from "@/constant/task";
import { PROGRESS_MAX_WIDTH } from "@/constant/constant";

const { Title, Text } = Typography;

const recentColumns: ColumnsType<Task> = [
  { title: "Tiêu đề", dataIndex: "title", key: "title", ellipsis: true },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 140,
    render: (_, r) => <StatusTag status={r.status} />,
  },
  {
    title: "Độ ưu tiên",
    dataIndex: "priority",
    key: "priority",
    width: 120,
    render: (_, r) => <PriorityTag priority={r.priority} />,
  },
  {
    title: "Người được giao",
    dataIndex: "assignee",
    key: "assignee",
    width: 160,
    render: (v?: string) => v ?? <Text type="secondary">—</Text>,
  },
  {
    title: "Hạn chót",
    dataIndex: "dueDate",
    key: "dueDate",
    width: 120,
    render: (v?: string) =>
      v ? formatDate(v) : <Text type="secondary">—</Text>,
  },
];

export default function DashboardPage() {
  const stats = useAppSelector(selectTaskStats);
  const recent = useAppSelector(selectRecentTasks);

  const ratio = (n: number) =>
    stats.total === 0 ? 0 : Math.round((n / stats.total) * 100);

  return (
    <Flex vertical gap="large">
      <Title level={3} className="!mb-0">
        Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng task" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Todo"
              value={stats.todo}
              valueStyle={{ color: STATUS_STAT_COLOR.todo }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              valueStyle={{ color: STATUS_STAT_COLOR.in_progress }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Done"
              value={stats.done}
              valueStyle={{ color: STATUS_STAT_COLOR.done }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Tỷ lệ theo trạng thái">
        <Flex vertical gap="middle" style={{ maxWidth: PROGRESS_MAX_WIDTH }}>
          <Flex vertical gap={4}>
            <Text type="secondary">Todo</Text>
            <Progress
              percent={ratio(stats.todo)}
              format={() => `${stats.todo}/${stats.total}`}
              strokeColor={STATUS_STAT_COLOR.todo}
              size="small"
            />
          </Flex>
          <Flex vertical gap={4}>
            <Text type="secondary">In Progress</Text>
            <Progress
              percent={ratio(stats.inProgress)}
              format={() => `${stats.inProgress}/${stats.total}`}
              status="active"
              size="small"
            />
          </Flex>
          <Flex vertical gap={4}>
            <Text type="secondary">Done</Text>
            <Progress
              percent={ratio(stats.done)}
              format={() => `${stats.done}/${stats.total}`}
              status="success"
              size="small"
            />
          </Flex>
        </Flex>
      </Card>

      <Card title="5 task tạo gần nhất">
        <Table<Task>
          rowKey="id"
          dataSource={recent}
          columns={recentColumns}
          pagination={false}
          size="middle"
          scroll={{ x: 720 }}
          locale={{ emptyText: "Chưa có task nào" }}
        />
      </Card>
    </Flex>
  );
}
