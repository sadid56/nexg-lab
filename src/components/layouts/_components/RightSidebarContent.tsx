"use client";
import * as React from "react";
import Link from "next/link";
import { Clock, Hash, Share2, Copy } from "lucide-react";
import { useState } from "react";

// Shadcn UI Components (Make sure these are installed in your project)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Keyword } from "@/types/keywords-types";
import { TBlog } from "@/types/blog-types";
import { Category } from "@/types/category-types";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// --------------------
// Section Header Component
// --------------------
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center gap-2'>
        {icon}
        <h3 className='font-bold text-sm tracking-tight text-gray-800 dark:text-gray-200'>{title}</h3>
      </div>
    </div>
  );
}

// --------------------
// Post Link Component
// --------------------
function PostLink({ post }: { post: TBlog }) {
  return (
    <Link
      href={`/read/${post.slug}`}
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
  );
}

// --------------------
// Modern Orange Tag Component
// --------------------
function ModernTag({ tag }: { tag: { title: string; slug: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category");

  const handleClickTag = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("category", category);
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <Button
      size={"sm"}
      onClick={() => handleClickTag(tag.slug)}
      className={cn(
        `inline-flex items-center rounded-full bg-gray-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-gray-600  hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-neutral-700 transition-colors`,
        tag.slug === category ? "text-orange-500  bg-orange-100" : "dark:text-gray-300"
      )}
    >
      {tag.title}
    </Button>
  );
}

// --------------------
// Share CTA Component with Shadcn Dialog
// --------------------
function ShareCTA() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className='p-5 rounded-xl bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg'>
            <Share2 className='h-5 w-5 text-white' />
          </div>
          <div>
            <h3 className='font-bold text-sm text-gray-800 dark:text-gray-200'>Share This Article</h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>Spread the knowledge</p>
          </div>
        </div>
        <Button
          onClick={() => setShowShareDialog(true)}
          className='w-full bg-gradient-to-r from-orange-500 to-amber-500  text-white shadow-lg hover:shadow-xl transition-all duration-300'
        >
          <Share2 className='h-4 w-4 mr-2' />
          Share Now
        </Button>
      </div>

      {/* Shadcn Dialog for Sharing */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className='sm:max-w-md p-6'>
          <DialogHeader className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500'>
                <Share2 className='h-5 w-5 text-white' />
              </div>
              <DialogTitle className='text-xl font-bold'>Share This Article</DialogTitle>
            </div>
            <DialogDescription className='text-gray-500 dark:text-gray-400'>
              Share this article with your friends and colleagues
            </DialogDescription>
          </DialogHeader>

          {/* Copy Link Section */}
          <div className='space-y-4 pt-4 border-gray-200 dark:border-gray-800'>
            <div className='relative'>
              <Input type='text' value={currentUrl} readOnly className='pr-12 font-mono text-sm bg-gray-50 dark:bg-gray-900' />
              <Button onClick={handleCopyLink} variant='outline' className='absolute right-1 top-1/2 transform -translate-y-1/2' size='sm'>
                {copied ? (
                  <>
                    <span className='text-green-600 mr-1'>✓</span>
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className='h-4 w-4 mr-1' />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className='flex gap-2'>
              <DialogClose asChild>
                <Button variant='outline' className='flex-1'>
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --------------------
// Right Sidebar Component
// --------------------
export default function RightSidebarContent({ category, recentPosts }: { category: Category[]; recentPosts: TBlog[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <aside className='space-y-8 px-4 sticky top-0 pt-20'>
      {/* Recent Posts Section */}
      <div className='space-y-1'>
        <SectionHeader
          icon={
            <div className='p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500'>
              <Clock className='h-4 w-4 text-white' />
            </div>
          }
          title='Recent Posts'
        />
        <div className='space-y-1'>
          {recentPosts?.map((post: TBlog) => (
            <PostLink key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className='h-px bg-gradient-to-r from-transparent via-orange-200 dark:via-orange-900 to-transparent' />

      {/* Popular Tags */}
      <div className='space-y-1'>
        <div className='flex items-center justify-between'>
          <SectionHeader
            icon={
              <div className='p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500'>
                <Hash className='h-4 w-4 text-white' />
              </div>
            }
            title='Popular Topics'
          />
          {searchParams.size !== 0 && (
            <Button
              onClick={() => router.replace("/")}
              className='mb-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all duration-300'
              size={"sm"}
            >
              Clear Filter
            </Button>
          )}
        </div>
        <div className='flex flex-wrap gap-2'>
          {category?.map((tag) => (
            <ModernTag key={tag.id} tag={tag} />
          ))}
        </div>
      </div>

      <div className='h-px bg-gradient-to-r from-transparent via-orange-200 dark:via-orange-900 to-transparent' />

      {/* Share CTA */}
      <ShareCTA />

      {/* Newsletter CTA */}
      <div className='p-4 rounded-xl bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm'>
        <h4 className='font-bold text-sm text-gray-800 dark:text-gray-200 mb-2'>Stay Updated</h4>
        <p className='text-xs text-gray-600 dark:text-gray-400 mb-3'>Get the latest articles delivered to your inbox</p>
        <div className='flex gap-2'>
          <input
            type='email'
            placeholder='Your email'
            className='flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 w-[70%] focus:outline-none focus:border-orange-500'
          />
          <Button className='w-[20%] bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all duration-300'>
            Join
          </Button>
        </div>
      </div>
    </aside>
  );
}
