import type { State } from '../../reducers/types/State';
import type { PrerequisiteForItems } from '../../types/PrerequisiteForItems';

export function CreateInitialFunction<T extends PrerequisiteForItems>(): State<T> {
  return {
    items: [],
    loading: true,
    totalItems: 0,
    hasMore: true,
    lastFailedPage: null,
    page: 1,
    error: null,
  };
}
