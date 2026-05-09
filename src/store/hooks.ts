import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '.';

export const useAppDispatch = useDispatch as () => AppDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
