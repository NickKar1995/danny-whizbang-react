import type { PrerequisiteForItems } from '../types/PrerequisiteForItems';
import type { Action } from './types/Action';
import type { State } from './types/State';

export function useInfiniteScrollReducer<T extends PrerequisiteForItems>(
  state: State<T>,
  action: Action<T>,
) {
  console.log('Reducer called with action:', action);
  console.log('Current state:', state);
  switch (action.type) {
    case 'FETCH_START':
      console.log('Reducer: FETCH_START');
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': {
      console.log('Reducer: FETCH_SUCCESS', action.payload);
      const allItems = [...state.items, ...action.payload.products];
      const uniqueItems = Array.from(new Map(allItems.map((item) => [item.id, item])).values());
      return {
        ...state,
        loading: false,
        items: uniqueItems,
        totalItems: action.payload.total,
        hasMore: action.payload.products.length >= action.payload.itemsPerPage,
        lastFailedPage: null,
      };
    }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
