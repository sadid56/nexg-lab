"use client";

import React, { useState } from "react";
import { useDeleteNewsletter, useNewsletters } from "@/react-query/newsletter/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Mail, Calendar, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { toast } from "sonner";
import { DashboardPageHeader } from "@/components/dashboard/header";
import { DashboardSearch } from "@/components/dashboard/search";
import { DashboardTable } from "@/components/dashboard/data-table";

const NewsletterPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useNewsletters({ search: search.trim(), page, limit });
  const deleteNewsletter = useDeleteNewsletter();

  const handleDelete = async (id: string) => {
    try {
      await deleteNewsletter.mutateAsync(id);
      toast.success("Subscriber removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove subscriber");
    }
  };

  const subscribers = data?.items || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className='space-y-6'>
      <DashboardPageHeader title='Newsletter Management' description='Manage your newsletter subscribers and community' />

      <DashboardSearch
        term={search}
        setTerm={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder='Search by email or name...'
        count={data?.total || 0}
        countLabel='subscribers'
      />

      <DashboardTable
        title='Subscribers'
        description='All users who have opted in for your newsletter'
        isLoading={isLoading}
        data={subscribers}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className='text-right px-6'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((item: any) => (
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
                      <span className='font-medium'>{item.user?.name || "Anonymous"}</span>
                      <span className='text-sm text-muted-foreground flex items-center gap-1'>
                        <Mail className='h-3 w-3' />
                        {item.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell className='text-right px-6'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size='sm' variant='ghost' className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Subscriber?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove <span className='font-semibold'>{item.email}</span> from the newsletter?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className='bg-destructive text-white hover:bg-destructive/90'
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

export default NewsletterPage;
