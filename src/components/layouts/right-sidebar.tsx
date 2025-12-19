import { GetRecentBlog } from "@/actions/blog-actions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import RightSidebarContent from "./_components/RightSidebarContent";
import { Suspense } from "react";
import { CACHE_TIME } from "@/constants/common";
import { TBlog } from "@/types/blog-types";

const RightSidebar = async () => {
  const queryClient = new QueryClient();

  const recentBlogs: TBlog[] = await queryClient.fetchQuery({
    queryKey: ["blogs"],
    queryFn: () => GetRecentBlog(),
    staleTime: CACHE_TIME[10],
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <RightSidebarContent recentPosts={recentBlogs ?? []} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default RightSidebar;
