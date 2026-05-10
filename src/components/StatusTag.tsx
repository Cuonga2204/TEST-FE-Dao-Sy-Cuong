import { Tag } from 'antd';
import type { TaskStatus } from '@/types/task';
import { STATUS_LABEL, STATUS_TAG_COLOR } from '@/constant/task';

interface Props {
  status: TaskStatus;
}

export default function StatusTag({ status }: Props) {
  return <Tag color={STATUS_TAG_COLOR[status]}>{STATUS_LABEL[status]}</Tag>;
}
