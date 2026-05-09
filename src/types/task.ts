export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  tags?: string[];
}

export interface TaskFilters {
  searchText: string;
  status: TaskStatus[];
  priority: TaskPriority | null;
  dateRange: [string, string] | null;
}

export interface TaskPagination {
  currentPage: number;
  pageSize: number;
}

export interface TasksState {
  items: Task[];
  filters: TaskFilters;
  pagination: TaskPagination;
  sort: TaskSort | null;
}

export type SortField = "title" | "dueDate" | "priority";
export type SortOrder = "asc" | "desc";
export interface TaskSort {
  field: SortField;
  order: SortOrder;
}
