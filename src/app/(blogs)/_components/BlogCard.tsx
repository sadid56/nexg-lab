import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { TBlog } from "@/types/blog-types";

export default function BlogCardHorizontal({ post }: { post: TBlog }) {
  return (
    <Card className='group relative h-full md:h-[320px] w-full overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-0 shadow-none backdrop-blur-sm transition-all duration-500'>
      <div className='relative flex h-full flex-col md:flex-row'>
        {/* Left: Thumbnail */}
        {post.coverImage && (
          <div className='relative  w-full aspect-video h-56 md:h-full md:w-2/5 flex-shrink-0 overflow-hidden'>
            <Image
              width={600}
              height={500}
              src={post.coverImage}
              alt={post.title}
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform'
            />

            {/* Category badge */}
            <div className='absolute top-4 left-4 z-10'>
              <Badge className='border-0 bg-gradient-to-r from-theme-primary to-theme-secondary px-3 py-1 text-white shadow-lg backdrop-blur-sm'>
                {post.category}
              </Badge>
            </div>
          </div>
        )}

        {/* Right: Content */}
        <CardContent className='flex h-full flex-col justify-between space-y-4 p-6 md:w-3/5 md:p-8 relative z-10'>
          <div className='space-y-4 overflow-hidden'>
            {/* Meta */}
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm'>
                <Clock className='h-3.5 w-3.5' />
                <span className='font-medium'>{post.readTime} min read</span>
              </div>
              <div className='h-1 w-1 rounded-full bg-muted-foreground/50' />
              <span className='text-xs font-medium text-muted-foreground'>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <Link href={`/read/${post.slug}`} className='group/link block'>
              <h3 className='text-xl md:text-2xl font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text transition-all duration-300 group-hover/link:from-theme-primary group-hover/link:to-theme-secondary'>
                {post.title}
              </h3>
            </Link>

            {/* Description */}
            <p className='line-clamp-3 text-sm md:text-base leading-relaxed text-muted-foreground'>{post.descriptions}</p>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between gap-4 border-t border-muted/30 pt-4'>
            {/* Tags */}
            <div className='flex flex-wrap gap-2 flex-1'>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant='outline'
                  className='text-xs border-muted transition-colors hover:border-theme-primary/50 hover:bg-theme-primary/5'
                >
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant='outline' className='text-xs'>
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/read/${post.slug}`}
              className='group/arrow flex items-center gap-2 text-sm font-semibold text-theme-primary transition-all duration-300 hover:gap-3'
            >
              Read
              <ArrowRight className='h-4 w-4 transition-transform group-hover/arrow:translate-x-1' />
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
