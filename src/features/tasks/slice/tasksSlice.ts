import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type {
  Task,
  TaskFilters,
  TaskSort,
  TasksState,
  TaskStatus,
} from "@/types/task";
import { mockTasks } from "@/mock/mockData";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constant/pagination";

const initialState: TasksState = {
  items: mockTasks,
  filters: {
    searchText: "",
    status: [],
    priority: null,
    dateRange: null,
  },
  pagination: {
    currentPage: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  },
  sort: null,
};

export type NewTaskInput = Omit<Task, "id" | "createdAt">;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">> & {
  id: string;
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<NewTaskInput>) => {
      const task: Task = {
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(task);
    },
    updateTask: (state, action: PayloadAction<UpdateTaskInput>) => {
      const { id, ...patch } = action.payload;
      const idx = state.items.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...patch };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    deleteManyTasks: (state, action: PayloadAction<string[]>) => {
      const idSet = new Set(action.payload);
      state.items = state.items.filter((t) => !idSet.has(t.id));
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>,
    ) => {
      const t = state.items.find((x) => x.id === action.payload.id);
      if (t) t.status = action.payload.status;
    },
    setFilter: <K extends keyof TaskFilters>(
      state: TasksState,
      action: PayloadAction<{ key: K; value: TaskFilters[K] }>,
    ) => {
      state.filters[action.payload.key] = action.payload.value;
      state.pagination.currentPage = DEFAULT_PAGE;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
      state.pagination.currentPage = DEFAULT_PAGE;
    },
    setPage: (
      state,
      action: PayloadAction<{ currentPage: number; pageSize?: number }>,
    ) => {
      state.pagination.currentPage = action.payload.currentPage;
      if (action.payload.pageSize) {
        state.pagination.pageSize = action.payload.pageSize;
      }
    },
    setSort: (state, action: PayloadAction<TaskSort | null>) => {
      state.sort = action.payload;
      state.pagination.currentPage = DEFAULT_PAGE;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
  setSort,
} = tasksSlice.actions;

export default tasksSlice.reducer;
