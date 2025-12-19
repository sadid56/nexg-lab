"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layout, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useSignOut from "@/hooks/useSignOut";
import Container from "@/components/global/Container";
import { ModeToggle } from "@/components/global/ModeToggle";
import { useOutsideClick } from "@/hooks/useOutSideClick";
import NavbarSearchBox from "./_components/NavbarSearchBox";
import NavbarMobileDrawer from "./_components/NavbarMobileDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import useCurrentUser from "@/hooks/useCurrentUser";
import { User } from "@/types/users-types";
import { IconBrandGithub } from "@tabler/icons-react";

const NavbarUserSkeleton = () => {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='w-[70px] h-8 rounded-md hidden sm:block' />
    </div>
  );
};

export default function Navbar() {
  const { user, isLoading } = useCurrentUser({});

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const router = useRouter();

  const { signout } = useSignOut();

  const ref = useOutsideClick(() => {
    setIsSearchOpen(false);
  });

  return (
    <>
      <nav
        ref={ref}
        className='w-full border-b border-gray-200 dark:border-gray-900 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-transparent dark:backdrop-blur-xl py-1'
      >
        <Container className='flex justify-between items-center py-1'>
          {/* Left side - Website Name */}
          <Link href='/'>
            <h1 className='flex items-center gap-2 text-2xl md:text-3xl font-mono font-semibold'>
              <span className='text-orange-400 animate-pulse'>{">"}</span>
              <div className='relative'>
                <span className='font-bold bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 bg-clip-text text-transparent animate-gradient'>
                  NexG
                </span>
                <span className='font-bold text-amber-200'>Lab</span>
                <span className='absolute -right-4 text-orange-300'>_</span>
              </div>
            </h1>
          </Link>

          {/* Desktop Right side */}
          <div className='hidden lg:flex items-center gap-4'>
            {/* Modern Search Input */}
            <Suspense
              fallback={<Skeleton className='w-full lg:w-[400px] h-9 rounded-md bg-gray-200 dark:bg-[#16120B] border border-[#1E1A14]' />}
            >
              <NavbarSearchBox />
            </Suspense>

            <ModeToggle />

            {/* GitHub Button */}
            <Button asChild variant='outline' size='sm' className='px-3 py-1'>
              <a href='https://github.com/sadid56/nexg-lab' target='_blank' rel='noopener noreferrer'>
                <IconBrandGithub stroke={2} /> GitHub
              </a>
            </Button>

            {/* Conditional User Section */}
            {isLoading ? (
              <NavbarUserSkeleton />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='flex w-[70px] items-center gap-2 rounded-full px-2 py-1'>
                    <img src={user.image || ""} className='w-8 h-8 rounded-full' alt={user.name} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{user.name}</span>
                      <span className='text-sm text-muted-foreground'>{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  {user?.role === "ADMIN" && (
                    <DropdownMenuItem>
                      <Layout className='mr-2 h-4 w-4' />
                      <Link href={"/dashboard"}>Dashboard</Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={signout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => router.push("/auth/sign-in")} variant='default' size='sm'>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Right side */}
          <Suspense>
            <NavbarMobileDrawer user={user as User} setIsSearchOpen={setIsSearchOpen} isSearchOpen={isSearchOpen} />
          </Suspense>
        </Container>

        {/* Mobile Search Bar */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <Container className='pb-5 pt-3'>
            <Suspense>
              <NavbarSearchBox />
            </Suspense>
          </Container>
        </div>
      </nav>
    </>
  );
}
