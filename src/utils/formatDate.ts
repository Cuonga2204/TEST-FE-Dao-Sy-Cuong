import dayjs from 'dayjs';
import { DATETIME_FORMAT, DATE_FORMAT } from '@/constant/constant';

export const formatDate = (iso: string) => dayjs(iso).format(DATE_FORMAT);

export const formatDateTime = (iso: string) =>
  dayjs(iso).format(DATETIME_FORMAT);
