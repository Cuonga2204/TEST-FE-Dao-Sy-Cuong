import { Select, Typography, theme } from "antd";
import { useAppDispatch } from "@/store/hooks";
import { updateTaskStatus } from "@/features/tasks/slice/tasksSlice";
import type { TaskStatus } from "@/types/task";
import { STATUS_LABEL, TASK_STATUSES } from "@/constant/task";

interface Props {
  taskId: string;
  status: TaskStatus;
}

export default function InlineStatusSelect({ taskId, status }: Props) {
  const dispatch = useAppDispatch();
  const { token } = theme.useToken();

  const palette: Record<TaskStatus, { bg: string; color: string }> = {
    todo: { bg: token.colorFillSecondary, color: token.colorTextSecondary },
    in_progress: { bg: token.colorPrimaryBg, color: token.colorPrimary },
    done: { bg: token.colorSuccessBg, color: token.colorSuccess },
  };

  return (
    <Select<TaskStatus>
      value={status}
      size="small"
      style={{ width: 140 }}
      variant="borderless"
      onChange={(next) =>
        dispatch(updateTaskStatus({ id: taskId, status: next }))
      }
      onClick={(e) => e.stopPropagation()}
      options={TASK_STATUSES.map((s) => ({
        value: s,
        label: STATUS_LABEL[s],
      }))}
      labelRender={({ value }) => {
        const s = value as TaskStatus;
        return (
          <Typography.Text style={{ color: palette[s].color, fontWeight: 500 }}>
            {STATUS_LABEL[s]}
          </Typography.Text>
        );
      }}
      optionRender={(opt) => {
        const s = opt.value as TaskStatus;
        return (
          <Typography.Text
            style={{
              backgroundColor: palette[s].bg,
              color: palette[s].color,
            }}
          >
            {STATUS_LABEL[s]}
          </Typography.Text>
        );
      }}
    />
  );
}
