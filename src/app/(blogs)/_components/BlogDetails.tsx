"use client";

import { useState } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMarkdownComponents } from "./MarkdownComponents";
import { TBlog } from "@/types/blog-types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Send, Hash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { feedbackSchema } from "@/validations/feedback";
import useCurrentUser from "@/hooks/useCurrentUser";
import { format } from "date-fns";
import Link from "next/link";
import { useSubmitFeedbacks } from "@/react-query/feedback/actions";

import ShareArticle from "./ShareArticle";
import { TYPOGRAPHY } from "@/store/useConfigStore";

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const BlogDetails = ({ blog }: { blog: TBlog }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useCurrentUser({});

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const markdownComponents = useMarkdownComponents();

  const submitFeedback = useSubmitFeedbacks();

  const emojis = [
    { emoji: "😍", label: "Love it" },
    { emoji: "👍", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "👎", label: "Not good" },
    { emoji: "😞", label: "Poor" },
  ];

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      emoji: "",
      feedback: "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues, anonymous: boolean = false) => {
    if (!user && !anonymous) {
      setShowSignInModal(true);
      return;
    }

    try {
      setIsLoading(true);

      await submitFeedback.mutateAsync({
        ...data,
        anonymous,
        postId: blog.id,
      });

      toast.success("Thank you for your feedback ❤️");

      form.reset();
      setShowSignInModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowSignInModal(true);
      return;
    }

    form.handleSubmit((data) => onSubmit(data, false))();
  };

  const handleAnonymousSubmit = () => {
    const values = form.getValues();
    onSubmit(values, true);
  };

  return (
    <div className='mb-10'>
      {/* Header */}
      <div className='flex items-center gap-4 mb-6'>
        <Link
          href={"/"}
          className='p-2 rounded-full hover:bg-theme-primary/10 text-muted-foreground hover:text-theme-primary transition-all duration-300'
        >
          <ArrowLeft className='h-6 w-6' />
        </Link>
        <h1 className={TYPOGRAPHY.title}>{blog.title}</h1>
      </div>

      <div className='flex items-center gap-3 mb-8 text-sm font-medium'>
        <div className='flex items-center gap-2 px-3 py-1 rounded-full bg-theme-primary/10 text-theme-primary'>
          <Hash className='h-3.5 w-3.5' />
          <span>{blog.category}</span>
        </div>
        <div className='h-1 w-1 rounded-full bg-muted-foreground/30' />
        <p className='text-muted-foreground'>Last updated: {format(new Date(blog.updatedAt), "MMMM dd, yyyy")}</p>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className='relative aspect-video w-full overflow-hidden rounded-3xl mb-8 shadow-2xl shadow-theme-primary/10 border border-theme-primary/10'>
          <Image
            fill
            src={blog.coverImage}
            alt={blog.title}
            className='object-cover hover:scale-105 transition-transform duration-700'
            priority
          />
        </div>
      )}

      {/* Tags & Sharing */}
      <div className='mb-10'>
        <ShareArticle title={blog.title} url={`/read/${blog.slug}`} />
      </div>

      {/* Description */}
      <div className={TYPOGRAPHY.description}>{blog.descriptions}</div>

      {/* Content */}
      <div className='prose prose-orange dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 mb-16'>
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {blog.content}
        </Markdown>
      </div>

      <div className='mt-12 border-t border-theme-primary/10 pt-12 max-w-2xl'>
        <h2 className='text-2xl font-bold mb-4'>Share Your Feedback</h2>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className='space-y-6'>
            {/* Emoji */}
            <FormField
              control={form.control}
              name='emoji'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex gap-3'>
                      {emojis.map((item) => (
                        <button
                          key={item.emoji}
                          type='button'
                          onClick={() => field.onChange(item.emoji)}
                          className={`flex flex-col cursor-pointer items-center gap-1 w-14 h-12 p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                            field.value === item.emoji
                              ? "border-theme-primary bg-theme-primary/10"
                              : "border-gray-200 hover:border-theme-primary/30 dark:border-gray-500"
                          }`}
                          title={item.label}
                        >
                          <span className='text-2xl'>{item.emoji}</span>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='feedback'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write your thoughts (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Share your detailed feedback here...' className='min-h-32 resize-none w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isLoading} className='bg-theme-primary hover:bg-theme-primary/90 text-white'>
              <Send className='w-4 h-4 mr-2' />
              {isLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>You’re not signed in. Would you like to sign in or submit anonymously?</DialogDescription>
          </DialogHeader>

          <DialogFooter className='flex flex-col gap-3 sm:flex-col mt-5'>
            <Button
              onClick={() => router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(pathname)}`)}
              className='bg-theme-primary hover:bg-theme-primary/90 w-full text-white'
            >
              Sign In to Submit
            </Button>

            <Button onClick={handleAnonymousSubmit} variant='outline' disabled={isLoading} className='w-full'>
              Submit Anonymously
            </Button>

            <Button onClick={() => setShowSignInModal(false)} variant='ghost' className='w-full'>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogDetails;
