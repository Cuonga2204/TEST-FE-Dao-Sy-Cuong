import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Task, TaskSort } from "@/types/task";

export const selectTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = createSelector(
  [selectTasksState],
  (s) => s.items,
);

export const selectFilters = createSelector(
  [selectTasksState],
  (s) => s.filters,
);

export const selectPagination = createSelector(
  [selectTasksState],
  (s) => s.pagination,
);

export const selectSort = createSelector([selectTasksState], (s) => s.sort);

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters],
  (items, filters) => {
    const search = filters.searchText.trim().toLowerCase();
    const [from, to] = filters.dateRange ?? [null, null];
    const fromTs = from ? new Date(from).getTime() : null;
    const toTs = to ? new Date(to).getTime() : null;

    return items.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search)) return false;
      if (filters.status.length > 0 && !filters.status.includes(t.status))
        return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (fromTs !== null || toTs !== null) {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate).getTime();
        if (fromTs !== null && due < fromTs) return false;
        if (toTs !== null && due > toTs) return false;
      }
      return true;
    });
  },
);

const PRIORITY_ORDER = {
  low: 0,
  medium: 1,
  high: 2,
};

const sortTasks = (items: Task[], sort: TaskSort): Task[] => {
  const sign = sort.order === "asc" ? 1 : -1;
  const arr = [...items];
  arr.sort((a, b) => {
    if (sort.field === "title") {
      return sign * a.title.localeCompare(b.title);
    }
    if (sort.field === "priority") {
      return sign * (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }
    const av = a.dueDate ? new Date(a.dueDate).getTime() : null;
    const bv = b.dueDate ? new Date(b.dueDate).getTime() : null;
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return sign * (av - bv);
  });
  return arr;
};

export const selectPaginatedTasks = createSelector(
  [selectFilteredTasks, selectSort, selectPagination],
  (items, sort, { currentPage, pageSize }) => {
    const sorted = sort ? sortTasks(items, sort) : items;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  },
);

export const selectTaskStats = createSelector([selectAllTasks], (items) => ({
  total: items.length,
  todo: items.filter((t) => t.status === "todo").length,
  inProgress: items.filter((t) => t.status === "in_progress").length,
  done: items.filter((t) => t.status === "done").length,
}));

export const selectRecentTasks = createSelector([selectAllTasks], (items) =>
  [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5),
);
