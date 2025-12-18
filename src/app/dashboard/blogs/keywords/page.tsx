"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoData } from "@/components/ui/no-data";

import { keywordFormSchema, KeywordFormData } from "@/validations/keyword";
import { useKeywords, useCreateKeyword, useUpdateKeyword, useDeleteKeyword } from "@/queries/actions/keywordsActions";
import { Keyword } from "@/types/keywords-types";

export default function KeywordsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: keywords = [], isLoading, refetch } = useKeywords();
  const createKeyword = useCreateKeyword();
  const updateKeyword = useUpdateKeyword();
  const deleteKeyword = useDeleteKeyword();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<KeywordFormData>({
    resolver: zodResolver(keywordFormSchema),
  });

  const resetForm = () => {
    reset();
    setEditingKeyword(null);
  };

  const onSubmit = async (data: KeywordFormData) => {
    setIsSubmitting(true);
    try {
      if (editingKeyword) {
        await updateKeyword.mutateAsync({ id: editingKeyword.id, data });
        toast.success("Keyword updated successfully");
      } else {
        await createKeyword.mutateAsync(data);
        toast.success("Keyword created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setValue("title", keyword.title);
    setValue("slug", keyword.slug || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKeyword.mutateAsync(id);
      toast.success("Keyword deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Keywords</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className='mr-2 h-4 w-4' />
              New Keyword
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingKeyword ? "Edit Keyword" : "Add Keyword"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input id='title' {...register("title")} placeholder='Enter keyword' />
                {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='slug'>Slug (Optional)</Label>
                <Input id='slug' {...register("slug")} placeholder='keyword-slug' />
                {errors.slug && <p className='text-sm text-red-500'>{errors.slug.message}</p>}
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {editingKeyword ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : keywords.length === 0 ? (
        <NoData title='No keywords found' description='Start by adding your first keyword' />
      ) : (
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((keyword: Keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className='font-medium'>{keyword.title}</TableCell>
                  <TableCell>
                    <code className='px-1 py-0.5 rounded bg-muted font-mono text-sm'>{keyword.slug}</code>
                  </TableCell>
                  <TableCell>{format(new Date(keyword.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end space-x-2'>
                      <Button variant='outline' size='sm' onClick={() => handleEdit(keyword)}>
                        <Edit className='h-4 w-4' />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='outline' size='sm' className='text-red-600 hover:text-red-700'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(keyword.id)} className='bg-red-600 hover:bg-red-700'>
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
        </div>
      )}
    </div>
  );
}
