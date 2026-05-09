import type { TaskPriority, TaskStatus } from "@/types/task";

export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];
export const TASK_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];

export const STATUS_LABEL = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

export const PRIORITY_LABEL = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const DEFAULT_TASK_STATUS = "todo";
export const DEFAULT_TASK_PRIORITY = "medium";

export const STATUS_TAG_COLOR = {
  todo: "default",
  in_progress: "processing",
  done: "success",
};

export const PRIORITY_TAG_COLOR = {
  high: "error",
  medium: "warning",
  low: "success",
};

export const STATUS_STAT_COLOR = {
  todo: "#8c8c8c",
  in_progress: "#1677ff",
  done: "#52c41a",
};

export const TASK_TITLE_MIN_LENGTH = 3;
export const TASK_TITLE_MAX_LENGTH = 120;
export const TASK_DESCRIPTION_MAX_LENGTH = 500;
export const TASK_ASSIGNEE_MAX_LENGTH = 100;
export const TASK_TAGS_MAX_COUNT = 10;
