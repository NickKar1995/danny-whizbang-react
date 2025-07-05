import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import type { UseInfiniteScrollOptions } from '../types/UseInfiniteScrollOptions';
import type { UseInfiniteScrollReturn } from '../types/UseInfiniteScrollReturn';
import type { PrerequisiteForItems } from '../types/PrerequisiteForItems';
import { useInfiniteScrollReducer } from '../reducers/useInfiniteScrollReducer';
import type { State } from '../reducers/types/State';

export function useInfiniteScroll<T extends PrerequisiteForItems>({
  fetchFunction,
  itemsPerPage = 19,
  threshold = 1.0,
  debounceMs = 300,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  console.log('Render InfiniteScroll');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const lastFailedPageRef = useRef<number | null>(null);

  const initialState: State<T> = {
    items: [],
    loading: false,
    totalItems: 0,
    hasMore: true,
    lastFailedPage: null,
    page: 1,
    error: null,
  };
  const [state, dispatch] = useReducer(useInfiniteScrollReducer, initialState);

  const loadItems = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);

        dispatch({ type: 'FETCH_START' });
        const data = await fetchFunction(pageNum);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { products: data.products, total: data.total, itemsPerPage },
        });
        setItems((prevItems) => {
          const allItems = [...prevItems, ...data.products];
          const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values());
          return uniqueItems;
        });
        setTotalItems(data.total);
        setError(null);
        lastFailedPageRef.current = null;
        if (data.products.length < itemsPerPage) {
          setHasMore(false);
        }
        console.log('δατα', data);
      } catch (error) {
        console.error('Error loading products:', error);
        lastFailedPageRef.current = pageNum;
        console.log('Last failed page set to:', lastFailedPageRef.current);
        setError(error instanceof Error ? error : new Error('Unknown error'));
        dispatch({type: 'FETCH_ERROR', payload: error instanceof Error ? error : new Error('Unknown error'), page: pageNum});
      } finally {
        setLoading(false);
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
        if (entries[0].isIntersecting && hasMore && !loading) {
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
  }, [hasMore, loading, threshold, debounceMs]);

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
