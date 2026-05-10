import { Tag } from 'antd';
import type { TaskPriority } from '@/types/task';
import { PRIORITY_LABEL, PRIORITY_TAG_COLOR } from '@/constant/task';

interface Props {
  priority: TaskPriority;
}

export default function PriorityTag({ priority }: Props) {
  return <Tag color={PRIORITY_TAG_COLOR[priority]}>{PRIORITY_LABEL[priority]}</Tag>;
}
