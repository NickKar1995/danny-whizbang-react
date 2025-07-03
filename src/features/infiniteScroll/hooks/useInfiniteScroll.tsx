import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseInfiniteScrollOptions } from '../types/UseInfiniteScrollOptions';
import type { UseInfiniteScrollReturn } from '../types/UseInfiniteScrollReturn';

export function useInfiniteScroll<T>({
  fetchFunction,
  itemsPerPage = 19,
  threshold = 1.0,
  debounceMs = 300,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<T[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  //   const [error, setError] = useState<null | Error>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadItems = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        const data = await fetchFunction(pageNum);
        setItems((prevItems) => [...prevItems, ...data.products]);
        setTotalItems(data.total);

        if (data.products.length < itemsPerPage) {
          setHasMore(false);
        }
        console.log('δατα', data);
      } catch (error) {
        console.error('Error loading products:', error);
        // setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, itemsPerPage],
  );

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
    items,
    loading,
    totalItems,
    hasMore,
    loaderRef,
  };
}
