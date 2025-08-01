
import { trpc , getQueryClient } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';
import { LoadProductFilters } from '@/modules/products/search-params';
import ProductListView from '@/modules/products/ui/views/product-list-view';
import { DEFAULT_LIMIT } from '@/constants';
interface props{
    params: Promise<{
        subcategory: string;
    }>,
    searchParams:Promise<SearchParams>
}
const CategoryPage  = async ({params,searchParams}:props) => {
    const { subcategory } = await params;
    const filters = await LoadProductFilters(searchParams);
    console.log("filters", filters);
    const queryClient=getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
        category:subcategory,
        ...filters,
        limit: DEFAULT_LIMIT,
    }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView category={subcategory} />
    </HydrationBoundary>

  )
}

export default CategoryPage