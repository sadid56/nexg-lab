"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, User, Settings, Loader2 } from "lucide-react";
import { ModeToggle } from "../global/ModeToggle";
import Container from "../global/Container";
import { useRouter } from "next/navigation";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useSignOut from "@/hooks/useSignOut";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();
  const { signout } = useSignOut();

  return (
    <nav className='w-full border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900'>
      <Container className='flex justify-between items-center h-16'>
        {/* Left side - Website Name */}
        <Link href='/' className='text-xl font-bold text-gray-900 dark:text-white'>
          NexG Lab
        </Link>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {/* Modern Search Input */}
          <div className='hidden sm:block'>
            <Input placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-64 sm:w-80' />
          </div>

          <ModeToggle />

          {/* GitHub Button */}
          <Button asChild variant='outline' size='sm' className='px-3 py-1'>
            <a href='https://github.com/sadid56/nexg-lab' target='_blank' rel='noopener noreferrer'>
              GitHub
            </a>
          </Button>

          {/* Conditional User Section */}
          {isLoading ? (
            <div className='flex w-[70px] h-8 items-center rounded-md gap-2 animate-pulse bg-gray-200'></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='flex items-center gap-2 rounded-full px-2 py-1'>
                  <Avatar>
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
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

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className='mr-2 h-4 w-4' /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className='mr-2 h-4 w-4' /> Settings
                </DropdownMenuItem>

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
      </Container>
    </nav>
  );
}
