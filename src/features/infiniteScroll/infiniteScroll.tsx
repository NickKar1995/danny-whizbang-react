import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from './types/Product';
import { CardComponent } from '../../shared/card/card';
import { fetchProducts } from './api/productsService';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

export function InfiniteScroll() {
  const {
    items: products,
    loading,
    error,
    hasMore,
    loaderRef,
    // retry,
  } = useInfiniteScroll({
    fetchFunction: fetchProducts,
    threshold: 1.0,
    debounceMs: 300,
    itemsPerPage: 19,
  });

  return (
    <>
      {products.map((product) => (
        <CardComponent key={product.id} title={product.title} body={product.description} />
      ))}
      <div ref={loaderRef} style={{ height: '1px' }} />
    </>
  );
}
