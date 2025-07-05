import { CardComponent } from '../../shared/card/card';
import { fetchProducts } from './api/productsService';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { Loader } from '../../shared/loader/loader';
import type { Product } from './types/Product';
import { ErrorPanel } from './components/errorPanel/errorPanel';
import { VerticalHasMore } from './components/verticalHasMore/verticalHasMore';

export function InfiniteScroll() {
  const {
    items: products,
    loading,
    error,
    hasMore,
    loaderRef,
    retry,
  } = useInfiniteScroll<Product>({
    fetchFunction: fetchProducts,
    threshold: 1.0,
    debounceMs: 300,
    itemsPerPage: 19,
  });

  return (
    <>
      {error && <ErrorPanel retry={retry} />}
      {loading && <Loader />}
      <div className="display flex justify-center">
        <div
          className="grid grid-cols-2 gap-4 p-4 mt-4"
          style={{
            boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.2)',
          }}
        >
          {products.map((product) => (
            <CardComponent key={product.id} title={product.title} body={product.description} />
          ))}
        </div>
      </div>
      {hasMore && !loading && <VerticalHasMore />}
      <div ref={loaderRef} style={{ height: '1px' }} />
    </>
  );
}
