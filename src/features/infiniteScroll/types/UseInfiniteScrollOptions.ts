export interface UseInfiniteScrollOptions<T> {
  fetchFunction: (page: number) => Promise<{ products: T[]; total: number }>;
  threshold?: number;
  debounceMs?: number;
  itemsPerPage?: number;
}
