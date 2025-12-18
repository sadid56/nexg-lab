import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { TBlog } from "@/types/blog-types";
import { BLUR_DATA_URL } from "@/constants/url";

export default function BlogCardHorizontal({ post }: { post: TBlog }) {
  return (
    <Card className='group relative rounded-3xl border-2 border-gray-200  transition-all duration-500 overflow-hidden backdrop-blur-sm p-0 shadow-none'>
      <div className='relative flex flex-col md:flex-row'>
        {/* Left: Image with overlay effects */}
        {post.coverImage && (
          <div className='relative w-full md:w-2/5 aspect-video flex-shrink-0 overflow-hidden'>
            <Image
              src={post.coverImage}
              alt={post.title}
              width={600}
              height={500}
              loading='lazy'
              placeholder='blur'
              blurDataURL={BLUR_DATA_URL}
              className='transition-transform duration-700 group-hover:scale-110 will-change-transform'
            />

            {/* Category badge floating on image */}
            <div className='absolute top-4 left-4 z-10'>
              <Badge className='bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1'>
                {post.category}
              </Badge>
            </div>
          </div>
        )}

        {/* Right: Content */}
        <CardContent className='flex flex-col justify-between p-6 md:p-8 md:w-3/5 space-y-4 relative z-10'>
          <div className='space-y-4'>
            {/* Meta info */}
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 backdrop-blur-sm'>
                <Clock className='h-3.5 w-3.5' />
                <span className='font-medium'>{post?.readTime} min read</span>
              </div>
              <div className='h-1 w-1 rounded-full bg-muted-foreground/50' />
              <span className='text-xs text-muted-foreground font-medium'>
                {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>

            {/* Title */}
            <Link href={`/read/${post.slug}`} className='block group/link'>
              <h3 className='text-xl md:text-2xl font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text group-hover/link:from-orange-500 group-hover/link:to-pink-500 transition-all duration-300'>
                {post.title}
              </h3>
            </Link>

            {/* Description */}
            <p className='text-sm md:text-base text-muted-foreground line-clamp-3 leading-relaxed'>{post.descriptions}</p>
          </div>

          {/* Tags and CTA */}
          <div className='flex items-center justify-between gap-4 pt-4 border-t border-muted/30'>
            <div className='flex flex-wrap gap-2 flex-1'>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant='outline'
                  className='text-xs border-muted hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors'
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

            {/* Read more CTA */}
            <Link
              href={`/read/${post.slug}`}
              className='flex items-center gap-2 text-sm font-semibold text-orange-500 hover:gap-3 transition-all duration-300 group/arrow'
            >
              Read
              <ArrowRight className='h-4 w-4 group-hover/arrow:translate-x-1 transition-transform' />
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
