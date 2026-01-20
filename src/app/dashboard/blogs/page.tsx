"use client";

import { DashboardPageHeader } from "@/components/dashboard/header";
import { DashboardSearch } from "@/components/dashboard/search";
import { DashboardTable } from "@/components/dashboard/data-table";
import { useState } from "react";
import { format } from "date-fns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { Status, statusOptions } from "@/theme/status-badge";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import Link from "next/link";
import { useBlogs, useDeleteBlog, useUpdateBlogStatus } from "@/react-query/blogs/actions";

export default function AllBlogs() {
  const { data: blogs = [], isLoading } = useBlogs();
  const deleteBlog = useDeleteBlog();
  const updateBlogStatus = useUpdateBlogStatus();
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingBlogId(id);
    try {
      await deleteBlog.mutateAsync(id);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeletingBlogId(null);
    }
  };

  const handleStatusChange = async (id: string, status: Status) => {
    setUpdatingStatusId(id);
    try {
      await updateBlogStatus.mutateAsync({ id, status });
    } catch (err: any) {
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const [search, setSearch] = useState("");

  const filteredBlogs = blogs.filter(
    (blog: any) =>
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      (blog.category && blog.category.toLowerCase().includes(search.toLowerCase())),
  );

  if (isLoading) return <TableSkeleton />;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <DashboardPageHeader title='All Blogs' description='Manage your blog posts'></DashboardPageHeader>
        <Link href='/dashboard/blogs/create'>
          <Button>Create Blog</Button>
        </Link>
      </div>

      <DashboardSearch term={search} setTerm={setSearch} placeholder='Search blogs...' count={filteredBlogs.length} countLabel='blogs' />

      <DashboardTable title='Blogs' description='List of all blog posts' isLoading={isLoading} data={filteredBlogs}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.map((blog: any) => (
              <TableRow key={blog.id}>
                <TableCell>
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className='h-12 w-16 object-cover rounded' />
                  ) : (
                    <div className='h-12 w-16 bg-muted rounded flex items-center justify-center text-sm'>No Image</div>
                  )}
                </TableCell>
                <TableCell className='font-medium'>{blog.title}</TableCell>
                <TableCell>{blog.category}</TableCell>
                <TableCell>{format(new Date(blog.updatedAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Select
                    value={blog.status}
                    onValueChange={(value) => handleStatusChange(blog.id, value as Status)}
                    disabled={updatingStatusId === blog.id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Link href={`/dashboard/blogs/edit/${blog?.id}`}>
                      {" "}
                      <Button variant='outline' size='sm'>
                        <Edit className='h-4 w-4' />
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='outline' size='sm' className='text-red-600 hover:text-red-700'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the blog &ldquo;{blog.title}&ldquo;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={deletingBlogId === blog.id}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className='bg-red-600 hover:bg-red-700'
                            onClick={() => handleDelete(blog.id)}
                            disabled={deletingBlogId === blog.id}
                          >
                            {deletingBlogId === blog.id ? "Deleting..." : "Delete"}
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
      </DashboardTable>
    </div>
  );
}
