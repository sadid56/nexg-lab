import { ModeToggle } from "@/components/global/ModeToggle";
import { Button } from "@/components/ui/button";
import { POPULAR_TOPICS } from "@/constants/common";
import { useIsMobile } from "@/hooks/use-mobile";
import useRecentBlogs from "@/hooks/useRecentBlogs";
import useSignOut from "@/hooks/useSignOut";
import { cn } from "@/lib/utils";
import { User } from "@/types/users-types";
import { IconBrandGithub } from "@tabler/icons-react";
import { Clock, Hash, Layout, LogOut, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";

interface NavbarMobileDrawerProps {
  setIsSearchOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  user: User;
}

const NavbarMobileDrawer: React.FC<NavbarMobileDrawerProps> = ({ setIsSearchOpen, isSearchOpen, user }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signout } = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const keywords = POPULAR_TOPICS;

  const { blogs: recentBlogs } = useRecentBlogs(isMobile);

  const [drawerHeight, setDrawerHeight] = useState("90vh");

  useEffect(() => {
    const updateHeight = () => setDrawerHeight(`${window.innerHeight * 0.9}px`);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleClickTag = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    router.replace(`/?${params.toString()}`, { scroll: false });
    setIsMenuOpen(false);
  };

  const category = searchParams.get("category");
  return (
    <div className='flex lg:hidden items-center gap-2'>
      {/* Mobile Search Toggle */}
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className='transition-transform duration-300 hover:scale-110'
      >
        <Search className='h-5 w-5' />
      </Button>

      <ModeToggle />

      {/* Mobile Menu Toggle with Vaul Drawer */}
      <Drawer.Root direction='right' open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <Drawer.Trigger asChild>
          <Button variant='ghost' size='icon' className='transition-transform duration-300 hover:scale-110'>
            <Menu />
          </Button>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className='fixed inset-0 bg-black/10 z-50 backdrop-blur-sm' />
          <Drawer.Content
            style={{ height: drawerHeight }}
            className='bg-white dark:bg-gray-950 flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 z-50'
          >
            <Drawer.Title className='sr-only'></Drawer.Title>
            <div className='p-4 bg-white dark:bg-gray-950 rounded-t-[10px] flex-1 overflow-y-auto'>
              {/* Drawer Handle */}
              <div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 mb-6' />

              {/* User Section */}
              <div className='mb-6'>
                {user ? (
                  <div className='flex flex-col gap-4 pb-4 border-b border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-3'>
                      <img src={user.image || ""} className='w-12 h-12 rounded-full' alt={user.name} />
                      <div className='flex flex-col'>
                        <span className='font-medium text-sm'>{user.name}</span>
                        <span className='text-xs text-muted-foreground'>{user.email}</span>
                      </div>
                    </div>
                    <div className={cn("grid gap-2", user?.role === "ADMIN" ? "grid-cols-3" : "grid-cols-2")}>
                      <Button onClick={signout} variant='outline' size='sm'>
                        <LogOut className='mr-2 h-4 w-4' /> Logout
                      </Button>
                      <Button variant='outline' size='sm'>
                        <a
                          className='flex items-center gap-2'
                          href='https://github.com/sadid56/nexg-lab'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <IconBrandGithub stroke={2} /> GitHub
                        </a>
                      </Button>
                      {user?.role === "ADMIN" && (
                        <Button onClick={() => router.push("/dashboard")} variant={"outline"} size={"sm"}>
                          <Layout /> Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => router.push("/auth/sign-in")} className='w-full' variant='default' size='sm'>
                    Sign In
                  </Button>
                )}
              </div>

              {/* Recent Posts Section */}
              {recentBlogs && recentBlogs.length > 0 && (
                <div className='mb-6'>
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500'>
                      <Clock className='h-4 w-4 text-white' />
                    </div>
                    <h3 className='font-bold text-sm tracking-tight text-gray-800 dark:text-gray-200'>Recent Posts</h3>
                  </div>
                  <div className='space-y-2'>
                    {recentBlogs.slice(0, 5).map((post) => (
                      <Link
                        key={post.id}
                        href={`/read/${post.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className='group flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800/50 transition-all duration-200 border border-transparent hover:border-orange-200 dark:hover:border-gray-800'
                      >
                        <div className='flex-1 min-w-0'>
                          <span className='text-sm font-medium leading-tight text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors block'>
                            {post.title}
                          </span>
                          {post.readTime && (
                            <div className='flex items-center gap-1 mt-1.5'>
                              <Clock className='h-3 w-3 text-gray-400' />
                              <span className='text-xs text-gray-500'>{post.readTime} min</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className='h-px bg-gradient-to-r from-transparent via-orange-200 dark:via-orange-900 to-transparent mb-6' />

              {/* Popular Topics */}
              {keywords && keywords.length > 0 && (
                <div className='mb-6'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <div className='p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500'>
                        <Hash className='h-4 w-4 text-white' />
                      </div>
                      <h3 className='font-bold text-sm tracking-tight text-gray-800 dark:text-gray-200'>Popular Topics</h3>
                    </div>
                    {searchParams.size !== 0 && (
                      <Button
                        onClick={() => {
                          router.replace("/");
                          setIsMenuOpen(false);
                        }}
                        className='bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all duration-300'
                        size={"sm"}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {keywords.map((tag) => (
                      <Button
                        key={tag.id}
                        size={"sm"}
                        onClick={() => handleClickTag(tag.slug)}
                        className={cn(
                          `inline-flex items-center rounded-full bg-gray-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-neutral-700 transition-colors`,
                          tag.slug === category ? "text-orange-500 bg-orange-100" : "dark:text-gray-300"
                        )}
                      >
                        {tag.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default NavbarMobileDrawer;
