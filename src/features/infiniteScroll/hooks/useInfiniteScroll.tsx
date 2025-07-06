import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { UseInfiniteScrollOptions } from '../types/UseInfiniteScrollOptions';
import type { UseInfiniteScrollReturn } from '../types/UseInfiniteScrollReturn';
import type { PrerequisiteForItems } from '../types/PrerequisiteForItems';
import { useInfiniteScrollReducer } from '../reducers/useInfiniteScrollReducer';
import { CreateInitialFunction } from './constants/initialState';

export function useInfiniteScroll<T extends PrerequisiteForItems>({
  fetchFunction,
  itemsPerPage = 19,
  threshold = 1.0,
  debounceMs = 300,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const lastFailedPageRef = useRef<number | null>(null);
  const initialState = CreateInitialFunction<T>();
  const [state, dispatch] = useReducer(useInfiniteScrollReducer, initialState);

  const loadItems = useCallback(
    async (pageNum: number) => {
      try {
        dispatch({ type: 'FETCH_START' });
        const data = await fetchFunction(pageNum);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { products: data.products, total: data.total, itemsPerPage },
        });
        lastFailedPageRef.current = null;
        console.log('δατα', data);
      } catch (error) {
        console.error('Error loading products:', error);
        lastFailedPageRef.current = pageNum;
        dispatch({
          type: 'FETCH_ERROR',
          payload: error instanceof Error ? error : new Error('Unknown error'),
          page: pageNum,
        });
      }
    },
    [fetchFunction, itemsPerPage],
  );

  const retry = useCallback(() => {
    if (lastFailedPageRef.current !== null) {
      loadItems(lastFailedPageRef.current);
    }
  }, [lastFailedPageRef, loadItems]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && state.hasMore && !state.loading) {
          timeoutId = setTimeout(() => {
            console.log('Loading more products...');
            setPage((prevPage) => prevPage + 1);
          }, debounceMs);
        }
      },
      {
        threshold,
      },
    );

    const loader = loaderRef.current;
    if (loader) {
      observer.observe(loader);
      if (timeoutId) clearTimeout(timeoutId);
    }

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [state.hasMore, state.loading, threshold, debounceMs]);

  useEffect(() => {
    loadItems(page);
  }, [page, loadItems]);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    totalItems: state.totalItems,
    hasMore: state.hasMore,
    loaderRef,
    retry,
  };
}
