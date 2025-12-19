"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useSignOut from "@/hooks/useSignOut";
import Container from "@/components/global/Container";
import { ModeToggle } from "@/components/global/ModeToggle";
import { User } from "@/types/users-types";
import { useOutsideClick } from "@/hooks/useOutSideClick";
import NavbarSearchBox from "./NavbarSearchBox";
import NavbarMobileDrawer from "./NavbarMobileDrawer";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavbarContent({ user }: { user: User }) {
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
          <Link href='/' className='text-xl font-bold text-gray-900 dark:text-white'>
            <img src='/logo.png' alt='Logo' loading='eager' className='w-32 sm:w-48 h-auto' />
          </Link>

          {/* Desktop Right side */}
          <div className='hidden lg:flex items-center gap-4'>
            {/* Modern Search Input */}
            <Suspense fallback={<Skeleton className='w-64 h-9 rounded-md bg-gray-200' />}>
              <NavbarSearchBox />
            </Suspense>

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
          <Suspense>
            <NavbarMobileDrawer setIsSearchOpen={setIsSearchOpen} isSearchOpen={isSearchOpen} />
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
