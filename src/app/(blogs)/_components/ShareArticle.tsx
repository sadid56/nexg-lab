"use client";

import { useState } from "react";
import { Share2, Copy, Twitter, Linkedin, Facebook, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareArticleProps {
  title: string;
  url: string;
  className?: string;
}

export default function ShareArticle({ title, url, className }: ShareArticleProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: <Twitter className='h-4 w-4' />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className='h-4 w-4' />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "Facebook",
      icon: <Facebook className='h-4 w-4' />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-4 py-6 border-b border-theme-primary/10 dark:border-theme-primary/20", className)}>
      <div className='flex items-center gap-2'>
        <div className='p-2 rounded-lg bg-linear-to-br from-theme-primary to-theme-secondary text-white shadow-lg shadow-theme-primary/20'>
          <Share2 className='h-4 w-4' />
        </div>
        <span className='font-bold text-sm text-gray-800 dark:text-gray-200'>Share this article</span>
      </div>

      <div className='flex items-center gap-2 flex-1'>
        <div className='flex items-center gap-2 p-1 md:p-1.5 rounded-full bg-muted/50 dark:bg-muted/20 border border-muted flex-1 max-w-[220px] md:max-w-md'>
          <div className='px-3 py-1 text-xs font-mono text-muted-foreground truncate flex-1'>{fullUrl || "Loading..."}</div>
          <Button
            size='sm'
            variant='ghost'
            className={cn(
              "h-8 rounded-full px-4 transition-all duration-300",
              copied ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : "hover:bg-theme-primary/10 hover:text-theme-primary",
            )}
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className='h-4 w-4' />
            ) : (
              <>
                <Copy className='h-4 w-4 mr-2' />
                <span className='text-xs font-bold uppercase tracking-wider'>Copy</span>
              </>
            )}
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className={cn(
                "p-2.5 rounded-full bg-muted/50 dark:bg-muted/20 border border-muted text-muted-foreground transition-all duration-300",
                link.color,
              )}
              title={`Share on ${link.name}`}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
