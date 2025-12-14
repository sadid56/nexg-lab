"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryFormSchema, CategoryFormData } from "@/validations/category";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/status-badge";
import { Status, statusOptions } from "@/theme/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/queries/actions/categoryActions";
import { Category } from "@/types/category-types";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { NoData } from "@/components/ui/no-data";

export default function CategoryTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
  });

  // Handle form submission using mutations
  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data });
        toast.success("Category updated successfully");
      } else {
        await createCategory.mutateAsync(data);
        toast.success("Category created successfully");
      }

      setIsDialogOpen(false);
      reset();
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue("title", category.title);
    setValue("slug", category.slug);
    setValue("status", category.status);
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    reset({ status: Status.pending });
    setEditingCategory(null);
  };

  return (
    <div className='space-y-6'>
      {/* Header & New Category Button */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Categories</h1>
          <p className='text-muted-foreground'>Manage your product categories</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className='mr-2 h-4 w-4' />
              New Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the category details below" : "Add a new category to your store"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Title Input */}
              <div className='space-y-2'>
                <Label htmlFor='title'>Title</Label>
                <Input id='title' {...register("title")} placeholder='Enter category title' />
                {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
              </div>

              {/* Status & Slug */}
              <div className='flex items-center gap-2'>
                <div className='space-y-2'>
                  <Label>Status</Label>
                  <Select value={watch("status")} onValueChange={(value) => setValue("status", value as Status)}>
                    <SelectTrigger className='mb-0'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className='text-sm text-red-500'>{errors.status.message}</p>}
                </div>
                <div className='space-y-2 w-full'>
                  <Label htmlFor='slug'>Slug</Label>
                  <Input id='slug' {...register("slug")} placeholder='auto-generated-from-title' />
                  {errors.slug && <p className='text-sm text-red-500'>{errors.slug.message}</p>}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
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
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : categories.length === 0 ? (
        <NoData title='No categories yet' description='Get started by creating your first category' />
      ) : (
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>{category.title}</TableCell>
                  <TableCell>
                    <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>{category.slug}</code>
                  </TableCell>
                  <TableCell>{format(new Date(category.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <StatusBadge status={category.status} />
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end space-x-2'>
                      <Button variant='outline' size='sm' onClick={() => handleEdit(category)}>
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
                            <AlertDialogDescription>
                              This will permanently delete the category &ldquo;{category.title}&ldquo;. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)} className='bg-red-600 hover:bg-red-700'>
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
