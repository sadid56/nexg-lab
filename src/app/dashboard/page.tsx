"use client";

import { Users, BookOpen, CheckCircle, MessageSquare } from "lucide-react";
import { useDashboardStats } from "@/react-query/dashboard/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCharts } from "./_components/DashboardCharts";
import { RecentActivity } from "./_components/RecentActivity";
import Link from "next/link";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./_components/StateCard";
import { DashboardPageHeader } from "@/components/dashboard/header";

const DashboardHome = () => {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className='space-y-8 animate-in fade-in duration-700'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <DashboardPageHeader title='Dashboard Overview' description="Welcome back! Here's a live look at your blog's performance." />
        <div className='hidden lg:flex items-center gap-3'>
          <Link href='/dashboard/blogs/create'>
            <Button className='rounded-xl px-6'>
              <Plus className='w-4 h-4 mr-2' />
              New Post
            </Button>
          </Link>
          <Link href='/dashboard/settings'>
            <Button variant='outline' size='icon' className='rounded-xl'>
              <Settings className='w-4 h-4' />
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Users'
          value={stats?.totalUsers}
          icon={Users}
          description='Registered community members'
          isLoading={isLoading}
          color='from-blue-600 to-indigo-600'
        />
        <StatCard
          title='All Blogs'
          value={stats?.totalBlogs}
          icon={BookOpen}
          description='Total content pieces created'
          isLoading={isLoading}
          color='from-violet-600 to-fuchsia-600'
        />
        <StatCard
          title='Active Blogs'
          value={stats?.activeBlogs}
          icon={CheckCircle}
          description='Published and live content'
          isLoading={isLoading}
          color='from-emerald-600 to-teal-600'
        />
        <StatCard
          title='Feedbacks'
          value={stats?.totalFeedbacks}
          icon={MessageSquare}
          description='Reader interactions & comments'
          isLoading={isLoading}
          color='from-amber-600 to-orange-600'
        />
      </div>

      {stats && !isLoading && (
        <>
          <DashboardCharts monthlyTrend={stats.monthlyTrend} />
          <RecentActivity recentBlogs={stats.recentBlogs} recentFeedbacks={stats.recentFeedbacks} />
        </>
      )}

      {isLoading && (
        <div className='space-y-6'>
          <Skeleton className='w-full h-[450px] rounded-3xl' />
          <div className='grid gap-6 md:grid-cols-2'>
            <Skeleton className='h-[300px] rounded-3xl' />
            <Skeleton className='h-[300px] rounded-3xl' />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
