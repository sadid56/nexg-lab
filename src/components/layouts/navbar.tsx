"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className='w-full border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-[1352px] mx-auto flex justify-between items-center h-16'>
        {/* Left side - Website Name */}
        <Link href='/' className='text-xl font-bold text-gray-900 dark:text-white'>
          MyTechBlog
        </Link>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {/* Search Dialog */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Search className='w-5 h-5' />
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <Input placeholder='Search...' autoFocus />
            </DialogContent>
          </Dialog>

          {/* GitHub Button */}
          <Button asChild variant='outline' size='sm' className='px-3 py-1'>
            <a href='https://github.com/yourusername' target='_blank' rel='noopener noreferrer'>
              GitHub
            </a>
          </Button>

          {/* Login Button */}
          <Button variant='default' size='sm'>
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
