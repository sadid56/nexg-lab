import { GetBlogs, GetHomeCategory } from "@/actions/blog-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import RightSidebarContent from "./_components/RightSidebarContent";
import { Suspense } from "react";

const RightSidebar = async () => {
  const queryClient = new QueryClient();

  const [recentBlogs, keywords]: any = await Promise.all([
    queryClient.fetchQuery({
      queryKey: ["recent-blogs"],
      queryFn: () => GetBlogs(),
      staleTime: Infinity,
    }),
    queryClient.fetchQuery({
      queryKey: ["home-category"],
      queryFn: () => GetHomeCategory(),
      staleTime: Infinity,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <RightSidebarContent category={keywords ?? []} recentPosts={recentBlogs ?? []} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default RightSidebar;
