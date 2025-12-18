import NavbarContent from "./_components/NavbarContent";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { GetCurrentUser } from "@/actions/auth-actions";
import { GetBlogs, GetHomeCategory } from "@/actions/blog-actions";
import { Suspense } from "react";

const Navbar = async () => {
  const queryClient = new QueryClient();

  const [user, recentBlogs, keywords]: any = await Promise.all([
    GetCurrentUser(),
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
        <NavbarContent user={user ?? null} recentBlogs={recentBlogs} keywords={keywords} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Navbar;
