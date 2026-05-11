import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectFilters,
  selectPagination,
  selectSort,
} from '@/features/tasks/slice/tasksSelectors';
import { setFilter, setPage, setSort } from '@/features/tasks/slice/tasksSlice';
import type { SortField, TaskPriority, TaskStatus } from '@/types/task';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constant/task';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constant/pagination';
import { URL_PARAM } from '@/constant/storage';

const SORT_FIELDS: SortField[] = ['title', 'dueDate', 'priority'];

const isStatus = (s: string): s is TaskStatus =>
  TASK_STATUSES.includes(s as TaskStatus);
const isPriority = (s: string): s is TaskPriority =>
  TASK_PRIORITIES.includes(s as TaskPriority);
const isSortField = (s: string): s is SortField =>
  SORT_FIELDS.includes(s as SortField);

export function useTaskUrlSync() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useAppSelector(selectFilters);
  const sort = useAppSelector(selectSort);
  const pagination = useAppSelector(selectPagination);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const q = searchParams.get(URL_PARAM.SEARCH) ?? '';
    if (q) dispatch(setFilter({ key: 'searchText', value: q }));

    const statusParam = searchParams.get(URL_PARAM.STATUS);
    if (statusParam) {
      const arr = statusParam.split(',').filter(isStatus);
      if (arr.length > 0) dispatch(setFilter({ key: 'status', value: arr }));
    }

    const priorityParam = searchParams.get(URL_PARAM.PRIORITY);
    if (priorityParam && isPriority(priorityParam)) {
      dispatch(setFilter({ key: 'priority', value: priorityParam }));
    }

    const from = searchParams.get(URL_PARAM.DATE_FROM);
    const to = searchParams.get(URL_PARAM.DATE_TO);
    if (from && to) {
      dispatch(setFilter({ key: 'dateRange', value: [from, to] }));
    }

    const sortField = searchParams.get(URL_PARAM.SORT_FIELD);
    const sortOrder = searchParams.get(URL_PARAM.SORT_ORDER);
    if (
      sortField && isSortField(sortField) &&
      (sortOrder === 'asc' || sortOrder === 'desc')
    ) {
      dispatch(setSort({ field: sortField, order: sortOrder }));
    }

    const page = Number(searchParams.get(URL_PARAM.PAGE));
    const pageSize = Number(searchParams.get(URL_PARAM.PAGE_SIZE));
    if (page > DEFAULT_PAGE || pageSize > 0) {
      dispatch(
        setPage({
          currentPage: page > 0 ? page : DEFAULT_PAGE,
          ...(pageSize > 0 ? { pageSize } : {}),
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    const params = new URLSearchParams();
    if (filters.searchText) params.set(URL_PARAM.SEARCH, filters.searchText);
    if (filters.status.length > 0) {
      params.set(URL_PARAM.STATUS, filters.status.join(','));
    }
    if (filters.priority) params.set(URL_PARAM.PRIORITY, filters.priority);
    if (filters.dateRange) {
      params.set(URL_PARAM.DATE_FROM, filters.dateRange[0]);
      params.set(URL_PARAM.DATE_TO, filters.dateRange[1]);
    }
    if (sort) {
      params.set(URL_PARAM.SORT_FIELD, sort.field);
      params.set(URL_PARAM.SORT_ORDER, sort.order);
    }
    if (pagination.currentPage !== DEFAULT_PAGE) {
      params.set(URL_PARAM.PAGE, String(pagination.currentPage));
    }
    if (pagination.pageSize !== DEFAULT_PAGE_SIZE) {
      params.set(URL_PARAM.PAGE_SIZE, String(pagination.pageSize));
    }
    setSearchParams(params, { replace: true });
  }, [filters, sort, pagination, setSearchParams]);
}
