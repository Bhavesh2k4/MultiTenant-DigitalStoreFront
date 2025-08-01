import type { SearchParams } from "nuqs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { DEFAULT_LIMIT } from "@/constants";
import { getQueryClient, trpc } from "@/trpc/server";

import  ProductListView  from "@/modules/products/ui/views/product-list-view";
import { LoadProductFilters}  from "@/modules/products/search-params";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await LoadProductFilters(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    }));

    return ( 
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductListView tenantSlug={slug} narrowView/>
      </HydrationBoundary>
    );
}
 
export default Page;
