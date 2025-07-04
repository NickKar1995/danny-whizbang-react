import { useCallback, useEffect, useRef, useState } from 'react';
import type { UseInfiniteScrollOptions } from '../types/UseInfiniteScrollOptions';
import type { UseInfiniteScrollReturn } from '../types/UseInfiniteScrollReturn';
import type { PrerequisiteForItems } from '../types/PrerequisiteForItems';

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

  const loadItems = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        const data = await fetchFunction(pageNum);
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
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, itemsPerPage],
  );

  const retry = useCallback(() => {
    console.log('Retrying failed page load...', lastFailedPageRef.current);
    if (lastFailedPageRef.current !== null) {
      console.log('WENT IN');
      console.log('Retrying to load items for page:', lastFailedPageRef.current);
      setError(null);
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
    items,
    loading,
    error,
    totalItems,
    hasMore,
    loaderRef,
    retry,
  };
}
