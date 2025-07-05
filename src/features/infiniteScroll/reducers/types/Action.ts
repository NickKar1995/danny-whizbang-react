export type Action<T> =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { products: T[]; total: number; itemsPerPage: number } }
  | { type: 'FETCH_ERROR'; payload: Error; page: number }
  | { type: 'INCREMENT_PAGE' }
  | { type: 'RETRY_FETCH' };
