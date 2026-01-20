"use client";

import BreadCrumb from "../common/BreadCrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { LogOut, Settings, LayoutDashboard, Layout } from "lucide-react";
import Link from "next/link";
import useSignOut from "@/hooks/useSignOut";

export const DashboardHeader = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { signout } = useSignOut();

  return (
    <header className='sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm transition-all duration-300'>
      {/* Left Side */}
      <div className='flex items-center gap-2'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='mx-2 h-4' />
        <BreadCrumb />
      </div>

      {/* Right Side */}
      <div className='flex items-center gap-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='relative h-9 w-9 rounded-full p-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary/20'
            >
              <Avatar className='h-9 w-9 border transition-all hover:border-primary/50'>
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className='bg-linear-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white'>
                  {user?.name?.slice(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-64 mt-2 rounded-2xl p-2 shadow-2xl ring-1 ring-black/5' align='end' forceMount>
            <DropdownMenuLabel className='font-normal p-2'>
              <div className='flex flex-col space-y-1 py-1'>
                <p className='text-sm font-bold leading-none text-foreground'>{user?.name || "Guest User"}</p>
                <p className='text-xs leading-none text-muted-foreground'>{user?.email || "No email provided"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='mx-1 my-1 opacity-50' />
            <DropdownMenuGroup className='p-1'>
              <Link href='/dashboard'>
                <DropdownMenuItem className='rounded-xl p-2.5 transition-all focus:bg-primary/5 focus:text-primary'>
                  <LayoutDashboard className='mr-3 h-4 w-4' />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link href='/dashboard/blogs'>
                <DropdownMenuItem className='rounded-xl p-2.5 transition-all focus:bg-primary/5 focus:text-primary'>
                  <Layout className='mr-3 h-4 w-4' />
                  <span>Blogs</span>
                </DropdownMenuItem>
              </Link>
              <Link href='/dashboard/settings'>
                <DropdownMenuItem className='rounded-xl p-2.5 transition-all focus:bg-primary/5 focus:text-primary'>
                  <Settings className='mr-3 h-4 w-4' />
                  <span>Preferences</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='mx-1 my-1 opacity-50' />
            <DropdownMenuItem
              className='rounded-xl p-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 transition-all cursor-pointer'
              onClick={() => signout()}
            >
              <LogOut className='mr-3 h-4 w-4' />
              <span className='font-semibold'>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
