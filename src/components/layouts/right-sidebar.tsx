"use client";
import * as React from "react";
import Link from "next/link";
import { Bookmark, Flame, TrendingUp, Plus, Compass, User, ArrowRight, Bell, Settings } from "lucide-react";

// --------------------
// Static Sidebar Data
// --------------------
const recentPosts = [
  { id: "1", title: "Next.js 15: What's New", slug: "nextjs-15-whats-new" },
  { id: "2", title: "Design Trends 2026", slug: "design-trends-2026" },
  { id: "3", title: "AI-Powered Development", slug: "ai-powered-dev" },
  { id: "4", title: "Modern Blog Setup", slug: "build-modern-blog-2026" },
];

const trendingPosts = [
  { id: "a", title: "React 20 Sneak Peek", slug: "react-20-sneak-peek" },
  { id: "b", title: "Figma 2026 Updates", slug: "figma-2026-updates" },
  { id: "c", title: "Micro-Animations Guide", slug: "micro-animations-guide" },
];

// --------------------
// Section Header Component
// --------------------
function SectionHeader({ icon, title, accent }: { icon: React.ReactNode; title: string; accent: string }) {
  return (
    <div className='flex items-center gap-2 mb-3'>
      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${accent}`}>{icon}</div>
      <h3 className='font-bold text-sm tracking-tight'>{title}</h3>
    </div>
  );
}

// --------------------
// Post Link Component
// --------------------
function PostLink({ post, hoverColor }: { post: { id: string; title: string; slug: string }; hoverColor: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group flex items-start gap-2 p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-200'
    >
      <div className='flex-1'>
        <span className={`text-sm leading-snug group-hover:${hoverColor} transition-colors block`}>
          {post.title.length > 35 ? post.title.slice(0, 35) + "…" : post.title}
        </span>
      </div>
      <ArrowRight className='h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex-shrink-0 mt-0.5' />
    </Link>
  );
}

// --------------------
// Quick Action Link
// --------------------
function QuickActionLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className='group flex items-center gap-3 p-3 rounded-xl border border-muted/50 hover:border-muted hover:bg-muted/30 transition-all duration-200'
    >
      <div className='text-muted-foreground group-hover:text-foreground transition-colors'>{icon}</div>
      <span className='text-sm font-medium flex-1'>{label}</span>
      <ArrowRight className='h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all' />
    </Link>
  );
}

// --------------------
// Right Sidebar Component
// --------------------
export default function RightSidebar() {
  return (
    <aside className='space-y-8 sticky top-24'>
      {/* Recent Posts Section */}
      <div className='space-y-1'>
        <SectionHeader icon={<Flame className='h-4 w-4 text-white' />} title='Recent Posts' accent='from-orange-500 to-red-500' />
        <div className='space-y-0.5'>
          {recentPosts.map((post) => (
            <PostLink key={post.id} post={post} hoverColor='text-orange-500' />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className='h-px bg-gradient-to-r from-transparent via-muted to-transparent' />

      {/* Trending Section */}
      <div className='space-y-1'>
        <SectionHeader icon={<TrendingUp className='h-4 w-4 text-white' />} title='Trending Now' accent='from-pink-500 to-purple-500' />
        <div className='space-y-0.5'>
          {trendingPosts.map((post) => (
            <PostLink key={post.id} post={post} hoverColor='text-pink-500' />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className='h-px bg-gradient-to-r from-transparent via-muted to-transparent' />

      {/* Quick Actions */}
      <div className='space-y-3'>
        <QuickActionLink href='/bookmarks' icon={<Bookmark className='h-4 w-4' />} label='My Bookmarks' />
        <QuickActionLink href='/profile' icon={<User className='h-4 w-4' />} label='Profile' />
        <QuickActionLink href='/notifications' icon={<Bell className='h-4 w-4' />} label='Notifications' />
        <QuickActionLink href='/settings' icon={<Settings className='h-4 w-4' />} label='Settings' />
      </div>
    </aside>
  );
}
