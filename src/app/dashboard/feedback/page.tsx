"use client";

import React, { useState } from "react";
import { useFeedbacks, useDeleteFeedback, useReplyToFeedback } from "@/react-query/feedback/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar, ExternalLink, ChevronLeft, ChevronRight, Trash2, Mail, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { DashboardPageHeader } from "@/components/dashboard/header";
import { DashboardSearch } from "@/components/dashboard/search";
import { DashboardTable } from "@/components/dashboard/data-table";
import { toast } from "sonner";

const FeedbackPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading } = useFeedbacks({ search: search.trim(), page, limit });
  const deleteFeedback = useDeleteFeedback();
  const replyToFeedback = useReplyToFeedback();

  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const feedbacks = data?.items || [];
  const totalPages = data?.totalPages || 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback.mutateAsync(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async () => {
    if (!selectedFeedback?.user?.email) {
      toast.error("No user email available for reply");
      return;
    }

    try {
      await replyToFeedback.mutateAsync({
        email: selectedFeedback.user.email,
        subject: replySubject,
        body: replyBody,
      });
      setReplyDialogOpen(false);
      setReplySubject("");
      setReplyBody("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  return (
    <div className='space-y-6'>
      <DashboardPageHeader title='Feedback Management' description='View and manage feedback from your readers' />

      <DashboardSearch
        term={search}
        setTerm={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder='Search feedback, posts, or users...'
        count={data?.total || 0}
        countLabel='feedbacks'
      />

      <DashboardTable title='Reader Feedback' description='Direct insights from your blog audience' isLoading={isLoading} data={feedbacks}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Reader</TableHead>
              <TableHead>Post</TableHead>
              <TableHead className='w-[35%]'>FeedbackContent</TableHead>
              <TableHead>Emoji</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className='text-right px-6'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-9 w-9 border'>
                      <AvatarImage src={item.user?.image} />
                      <AvatarFallback className='bg-primary/10 text-primary'>
                        {item.user?.name?.[0].toUpperCase() || <User className='h-4 w-4' />}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{item.anonymous ? "Anonymous" : item.user?.name || "Anonymous Reader"}</span>
                      {!item.anonymous && item.user?.email && (
                        <span className='text-xs text-muted-foreground truncate max-w-[150px]'>{item.user.email}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col max-w-[200px]'>
                    <span className='font-medium truncate'>{item.post?.title || "N/A"}</span>
                    {item.post?.slug && (
                      <Link
                        href={`/read/${item.post.slug}`}
                        target='_blank'
                        className='text-xs text-primary flex items-center gap-1 hover:underline'
                      >
                        <ExternalLink className='h-3 w-3' />
                        View Post
                      </Link>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='text-sm leading-relaxed max-w-[400px] break-all'>
                    {item.feedback || <span className='italic text-muted-foreground'>No text provided</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className='text-xl' title='User Reaction'>
                    {item.emoji}
                  </span>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap'>
                    <Calendar className='h-3.5 w-3.5' />
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className='text-right px-6'>
                  <div className='flex items-center justify-end gap-1'>
                    {!item.anonymous && item.user?.email && (
                      <Dialog open={replyDialogOpen && selectedFeedback?.id === item.id} onOpenChange={setReplyDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-primary'
                            onClick={() => {
                              setSelectedFeedback(item);
                              setReplySubject(`Reply to your feedback on: ${item.post?.title || "our blog"}`);
                              setReplyDialogOpen(true);
                            }}
                          >
                            <Mail className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reply to {item.user.name}</DialogTitle>
                            <DialogDescription>Send an email reply to this feedback.</DialogDescription>
                          </DialogHeader>
                          <div className='space-y-4 py-4'>
                            <div className='space-y-2'>
                              <Label>Recipient Email</Label>
                              <Input value={item.user.email} disabled />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='subject'>Subject</Label>
                              <Input
                                id='subject'
                                value={replySubject}
                                onChange={(e) => setReplySubject(e.target.value)}
                                placeholder='Enter subject...'
                              />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='body'>Message body</Label>
                              <Textarea
                                id='body'
                                value={replyBody}
                                onChange={(e) => setReplyBody(e.target.value)}
                                placeholder='Write your reply here...'
                                className='min-h-[150px]'
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant='outline' onClick={() => setReplyDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleReply} disabled={replyToFeedback.isPending}>
                              {replyToFeedback.isPending ? "Sending..." : "Send Reply"}
                              <Send className='ml-2 h-4 w-4' />
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8 text-destructive'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Feedback?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this feedback? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className='bg-destructive text-white hover:bg-destructive/90'
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className='flex items-center justify-end space-x-2 py-4'>
            <Button variant='outline' size='sm' onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft className='h-4 w-4 mr-1' /> Previous
            </Button>
            <div className='text-sm font-medium'>
              Page {page} of {totalPages}
            </div>
            <Button variant='outline' size='sm' onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Next <ChevronRight className='h-4 w-4 ml-1' />
            </Button>
          </div>
        )}
      </DashboardTable>
    </div>
  );
};

export default FeedbackPage;
