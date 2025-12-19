import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardHorizontalSkeleton() {
  return (
    <Card className='relative rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden p-0 shadow-none w-full lg:h-[320px]'>
      <div className='relative flex flex-col md:flex-row animate-pulse'>
        {/* Left: Image Skeleton */}
        <div className='relative w-full aspect-video h-56 md:h-full md:w-2/5 flex-shrink-0 overflow-hidden'>
          <Skeleton className='h-full w-full rounded-none' />

          {/* Category badge skeleton */}
          <div className='absolute top-4 left-4 z-10'>
            <Skeleton className='h-6 w-24 rounded-full' />
          </div>
        </div>

        {/* Right: Content Skeleton */}
        <CardContent className='flex flex-col justify-between p-6 md:p-8 md:w-3/5 space-y-4'>
          <div className='space-y-4'>
            {/* Meta info */}
            <div className='flex items-center gap-3'>
              <Skeleton className='h-6 w-28 rounded-full' />
              <Skeleton className='h-1 w-1 rounded-full' />
              <Skeleton className='h-4 w-20 rounded-md' />
            </div>

            {/* Title */}
            <div className='space-y-2'>
              <Skeleton className='h-6 w-full rounded-lg' />
              <Skeleton className='h-6 w-3/4 rounded-lg' />
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full rounded-md' />
              <Skeleton className='h-4 w-full hidden lg:block rounded-md' />
              <Skeleton className='h-4 w-full rounded-md' />
              <Skeleton className='h-4 w-2/3 rounded-md' />
            </div>
          </div>

          {/* Tags + CTA */}
          <div className='flex items-center justify-between gap-4 pt-4 border-t border-muted/30'>
            <div className='flex flex-wrap gap-2 flex-1'>
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-16 rounded-full' />
              <Skeleton className='h-6 w-16 rounded-full' />
            </div>

            <Skeleton className='h-5 w-14 rounded-md' />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
