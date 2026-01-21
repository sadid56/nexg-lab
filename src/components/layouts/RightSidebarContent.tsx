"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Hash, SlidersHorizontal, Mail, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { POPULAR_TOPICS } from "@/constants/common";
import useRecentBlogs from "@/hooks/useRecentBlogs";
import { useConfigStore } from "@/store/useConfigStore";
import { TBlog } from "@/types/blog-types";
import { toast } from "sonner";
import { PostNewsLetter } from "@/actions/newsletter-action";
import { Input } from "@/components/ui/input";

// --------------------
// Section Header Component
// --------------------
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className='flex items-center justify-between mb-3'>
      <div className='flex items-center gap-3'>
        {icon}
        <h3 className='font-bold text-sm tracking-tight text-gray-800 dark:text-gray-200'>{title}</h3>
      </div>
    </div>
  );
}

const BlogItemSkeleton = () => {
  return (
    <div className='flex items-start gap-3 p-3 rounded-xl border border-transparent'>
      <div className='flex-1 min-w-0 space-y-2'>
        <Skeleton className='h-3.5 w-full rounded-md' />
        <Skeleton className='h-3 w-1/2 rounded-md' />
        <div className='flex items-center gap-1.5 pt-1'>
          <Skeleton className='h-3 w-3 rounded-full' />
          <Skeleton className='h-3 w-10 rounded-md' />
        </div>
      </div>
    </div>
  );
};

// --------------------
// Post Link Component
// --------------------
function PostLink({ post }: { post: TBlog }) {
  return (
    <Link
      href={`/read/${post.slug}`}
      className='group flex items-start gap-3 p-3 rounded-xl hover:bg-theme-primary/10 transition-all duration-300 border border-transparent hover:border-theme-primary/20'
    >
      <div className='flex-1 min-w-0'>
        <span className='text-sm font-bold leading-snug text-gray-800 dark:text-gray-200 group-hover:text-theme-primary transition-colors block line-clamp-2'>
          {post.title}
        </span>
        {post.readTime && (
          <div className='flex items-center gap-1.5 mt-2'>
            <Clock className='h-3 w-3 text-muted-foreground' />
            <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>{post.readTime} min read</span>
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

  const handleClickTag = (catSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", catSlug);
    params.delete("page");
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  const isActive = tag.slug === category;

  return (
    <Button
      size={"sm"}
      onClick={() => handleClickTag(tag.slug)}
      variant='ghost'
      className={cn(
        "h-8 rounded-full px-3 text-[11px] font-bold uppercase tracking-wider transition-all duration-300",
        isActive
          ? "bg-theme-primary text-white shadow-lg shadow-theme-primary/20"
          : "bg-muted/50 text-muted-foreground hover:bg-theme-primary/10 hover:text-theme-primary",
      )}
    >
      {tag.title}
    </Button>
  );
}

// --------------------
// Right Sidebar Component
// --------------------
export default function RightSidebarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setShowTweakDialog, shortcutKeys } = useConfigStore();
  const { blogs: recentPosts, isLoading } = useRecentBlogs();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      return toast.warning("Please type your email first!");
    }

    try {
      setSubmitting(true);
      const res = await PostNewsLetter(email);
      if (res?.status === 201) {
        setEmail("");
        toast.success("Welcome to the lab! 🧪 You will get latest updates in your email.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Newsletter submit failed!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className='flex flex-col px-4 sticky top-0 pt-16 pb-10 gap-6'>
      {/* Recent Posts Section */}
      <div className='space-y-3'>
        <SectionHeader
          icon={
            <div className='p-2 rounded-xl bg-linear-to-br from-theme-primary to-theme-secondary text-white shadow-lg shadow-theme-primary/20'>
              <Clock className='h-4 w-4' />
            </div>
          }
          title='Recent Stories'
        />
        <div className='space-y-1'>
          {isLoading ? (
            <div className='space-y-2'>
              {Array.from({ length: 3 }).map((_, i) => (
                <BlogItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className='space-y-1'>
              {recentPosts?.slice(0, 5).map((post: any) => (
                <PostLink key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='h-px bg-linear-to-r from-transparent via-muted to-transparent' />

      {/* Popular Topics */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <SectionHeader
            icon={
              <div className='p-2 rounded-xl bg-linear-to-br from-theme-secondary to-theme-primary text-white shadow-lg shadow-theme-secondary/20'>
                <Hash className='h-4 w-4' />
              </div>
            }
            title='Top Categories'
          />
          {searchParams.size !== 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.replace("/")}
              className='text-[10px] font-bold text-theme-primary hover:bg-theme-primary/10'
            >
              Reset
            </Button>
          )}
        </div>
        <div className='flex flex-wrap gap-2'>
          {POPULAR_TOPICS.map((tag) => (
            <ModernTag key={tag.id} tag={tag} />
          ))}
        </div>
      </div>

      <div className='h-px bg-linear-to-r from-transparent via-muted to-transparent' />
      <div
        className='group relative p-1 rounded-2xl bg-linear-to-br from-theme-primary/20 via-transparent to-theme-secondary/20 border border-theme-primary/10 hover:border-theme-primary/30 transition-all duration-500 cursor-pointer overflow-hidden'
        onClick={() => setShowTweakDialog(true)}
      >
        <div className='absolute inset-0 bg-linear-to-r from-theme-primary/5 to-theme-secondary/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700' />

        <div className='relative flex items-center justify-between p-4 rounded-xl bg-background/40 backdrop-blur-md border border-white/5'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-xl bg-linear-to-br from-theme-primary to-theme-secondary text-white shadow-lg shadow-theme-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300'>
              <SlidersHorizontal className='h-4 w-4' />
            </div>
            <div>
              <h3 className='font-bold text-sm tracking-tight'>Personalize</h3>
              <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider'>Lab Settings</p>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <Kbd className='bg-theme-primary/10 text-theme-primary border-none px-2 py-1'>Shift+{shortcutKeys.tweakDialog}</Kbd>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}

      <div className='h-px bg-linear-to-r from-transparent via-muted to-transparent' />

      <div className='group relative p-6 rounded-3xl bg-linear-to-br from-theme-primary/5 to-theme-secondary/5 border border-theme-primary/10 overflow-hidden'>
        <div className='absolute -top-10 -right-10 w-32 h-32 bg-theme-primary/5 blur-3xl rounded-full transition-all group-hover:bg-theme-primary/10' />

        <div className='relative space-y-3'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-xl bg-linear-to-br from-theme-primary to-theme-secondary text-white shadow-lg shadow-theme-primary/20'>
              <Mail className='h-4 w-4' />
            </div>
            <div>
              <h3 className='font-bold text-sm tracking-tight'>Newsletter</h3>
              <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-wider'>Join the Lab</p>
            </div>
          </div>

          <p className='text-xs text-muted-foreground leading-relaxed'>
            Get the latest articles and lab experiments delivered to your inbox.
          </p>

          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='h-10 rounded-xl bg-background/50 border-theme-primary/10 focus-visible:ring-theme-primary/20 placeholder:text-muted-foreground/50 text-xs font-medium'
            />
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className='w-full h-10 rounded-xl bg-linear-to-r from-theme-primary to-theme-secondary text-white shadow-lg shadow-theme-primary/20 hover:shadow-theme-primary/30 transition-all duration-300 font-bold text-xs uppercase tracking-widest'
            >
              {submitting ? <Loader2 className='h-4 w-4 animate-spin' /> : "Subscribe"}
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
