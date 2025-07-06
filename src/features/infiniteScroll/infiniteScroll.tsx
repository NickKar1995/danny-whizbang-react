import { CardComponent } from '../../shared/card/card';
import { fetchProducts } from './api/productsService';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';
import { Loader } from '../../shared/loader/loader';
import type { Product } from './types/Product';
import { ErrorPanel } from './components/errorPanel/errorPanel';
import { VerticalHasMore } from './components/verticalHasMore/verticalHasMore';
import { CustomLayout } from '../../shared/layout/customLayout';

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
      <CustomLayout>
        {products.map((product) => (
          <CardComponent key={product.id} title={product.title} body={product.description} />
        ))}
      </CustomLayout>
      {hasMore && !loading && <VerticalHasMore />}
      <div ref={loaderRef} style={{ height: '1px' }} />
    </>
  );
}
