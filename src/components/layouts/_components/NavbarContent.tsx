"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Menu, X, Search, Clock, Hash, Share2, Copy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer } from "vaul";
import useSignOut from "@/hooks/useSignOut";
import Container from "@/components/global/Container";
import { ModeToggle } from "@/components/global/ModeToggle";
import { User } from "@/types/users-types";
import { TBlog } from "@/types/blog-types";
import { Category } from "@/types/category-types";
import { cn } from "@/lib/utils";
import { useOutsideClick } from "@/hooks/useOutSideClick";

export default function NavbarContent({ user, recentBlogs, keywords }: { user: User; recentBlogs: TBlog[]; keywords: Category[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);

  const { signout } = useSignOut();

  const ref = useOutsideClick(() => {
    setIsSearchOpen(false);
    console.log("Clicked outside of MyComponent");
  });

  useEffect(() => {
    if (!isSearching) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchQuery.trim()) {
        params.set("search", searchQuery);
        router.replace(`/?${params.toString()}`, { scroll: false });
      } else {
        params.delete("search");
        router.replace("/", { scroll: false });
      }

      setIsSearching(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery, isSearching, router, searchParams]);

  const handleClickTag = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    router.replace(`/?${params.toString()}`, { scroll: false });
    setIsMenuOpen(false);
  };

  const category = searchParams.get("category");

  return (
    <>
      <nav
        ref={ref}
        className='w-full border-b border-gray-200 dark:border-gray-900 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-transparent dark:backdrop-blur-xl py-1'
      >
        <Container className='flex justify-between items-center py-1'>
          {/* Left side - Website Name */}
          <Link href='/' className='text-xl font-bold text-gray-900 dark:text-white'>
            <img src='/logo.png' alt='Logo' loading='eager' className='w-32 sm:w-48 h-auto' />
          </Link>

          {/* Desktop Right side */}
          <div className='hidden lg:flex items-center gap-4'>
            {/* Modern Search Input */}
            <Input
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              className='w-64 sm:w-80'
            />

            <ModeToggle />

            {/* GitHub Button */}
            <Button asChild variant='outline' size='sm' className='px-3 py-1'>
              <a href='https://github.com/sadid56/nexg-lab' target='_blank' rel='noopener noreferrer'>
                GitHub
              </a>
            </Button>

            {/* Conditional User Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='flex items-center gap-2 rounded-full px-2 py-1'>
                    <div>
                      <img src={user.image || ""} className='w-8 h-8 rounded-full' alt={user.name} />
                    </div>
                    <span className='hidden sm:block'>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{user.name}</span>
                      <span className='text-sm text-muted-foreground'>{user.email}</span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuItem onClick={signout}>
                    <LogOut className='mr-2 h-4 w-4' /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/auth/sign-in")} className='cursor-pointer' variant='default' size='sm'>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Right side */}
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
                <Drawer.Content className='bg-white dark:bg-gray-950 flex flex-col rounded-t-[10px] h-[90vh] fixed bottom-0 left-0 right-0 z-50'>
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
                          <div className='flex gap-2 items-center '>
                            <Button onClick={signout} variant='outline' className='w-1/2 justify-start' size='sm'>
                              <LogOut className='mr-2 h-4 w-4' /> Logout
                            </Button>
                            <Button variant='outline' className=' justify-start w-1/2' size='sm'>
                              <a href='https://github.com/sadid56/nexg-lab' target='_blank' rel='noopener noreferrer'>
                                GitHub
                              </a>
                            </Button>
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
        </Container>

        {/* Mobile Search Bar */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Container className='pb-5 pt-3'>
            <Input
              placeholder='Search...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              className='w-full'
            />
          </Container>
        </div>
      </nav>
    </>
  );
}
