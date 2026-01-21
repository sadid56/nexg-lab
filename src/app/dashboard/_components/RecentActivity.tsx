"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Status } from "@/theme/status-badge";

interface ActivityProps {
  recentBlogs: {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    status: string;
  }[];
  recentFeedbacks: {
    id: string;
    feedback: string;
    createdAt: string;
    post: { title: string };
  }[];
}

export function RecentActivity({ recentBlogs, recentFeedbacks }: ActivityProps) {
  return (
    <div className='grid gap-6 md:grid-cols-2'>
      <Card className='border-muted/50 overflow-hidden group hover:shadow-md transition-all duration-300'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Recent Blogs</CardTitle>
            <CardDescription>The latest posts added to your blog</CardDescription>
          </div>
          <Link href='/dashboard/blogs' className='p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground'>
            <ChevronRight className='w-5 h-5' />
          </Link>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentBlogs.map((blog) => (
              <div key={blog.id} className='flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group/item'>
                <div className='w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500'>
                  <BookOpen className='w-5 h-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold truncate group-hover/item:text-blue-500 transition-colors'>{blog.title}</p>
                  <p className='text-xs text-muted-foreground'>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</p>
                </div>
                <StatusBadge status={blog.status as Status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className='border-muted/50 overflow-hidden group hover:shadow-md transition-all duration-300'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Latest Feedbacks</CardTitle>
            <CardDescription>What people are saying about your content</CardDescription>
          </div>
          <Link href='/dashboard/feedback' className='p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground'>
            <ChevronRight className='w-5 h-5' />
          </Link>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {recentFeedbacks.map((item) => (
              <div key={item.id} className='flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors'>
                <div className='w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0'>
                  <MessageSquare className='w-5 h-5' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium line-clamp-2 italic'>&ldquo;{item.feedback || "No comment"}&ldquo;</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    on <span className='font-semibold'>{item.post.title}</span> &bull;{" "}
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
