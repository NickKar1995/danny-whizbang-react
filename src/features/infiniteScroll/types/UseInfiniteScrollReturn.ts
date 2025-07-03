export interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  // error: Error | null;
  hasMore: boolean;
  totalItems: number;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  // retry: () => void;
  // reset: () => void;
}
