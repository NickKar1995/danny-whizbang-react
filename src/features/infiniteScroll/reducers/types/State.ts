export type State<T> = {
  loading: boolean;
  items: T[];
  totalItems: number;
  page: number;
  hasMore: boolean;
  error: Error | null;
  lastFailedPage: number | null;
};
