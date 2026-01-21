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
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/react-query/categories/actions";
import { Category } from "@/types/category-types";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { DashboardPageHeader } from "@/components/dashboard/header";
import { DashboardSearch } from "@/components/dashboard/search";
import { DashboardTable } from "@/components/dashboard/data-table";

export default function CategoryTable() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(editingCategory?.id || "");
  const deleteCategory = useDeleteCategory();

  const filteredCategories = categories.filter((category: Category) => category.title.toLowerCase().includes(search.toLowerCase()));

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
        await updateCategory.mutateAsync(data);
      } else {
        await createCategory.mutateAsync(data);
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
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    reset({ status: Status.pending });
    setEditingCategory(null);
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <DashboardPageHeader title='Categories' description='Manage your product categories'></DashboardPageHeader>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className='lg:mr-2 h-4 w-4' />
              <span className='hidden lg:block'>New Category</span>
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

      <DashboardSearch
        term={search}
        setTerm={setSearch}
        placeholder='Search categories...'
        count={filteredCategories.length}
        countLabel='categories'
      />

      <DashboardTable title='Categories List' description='All available categories' isLoading={isLoading} data={filteredCategories}>
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
            {filteredCategories.map((category: Category) => (
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
      </DashboardTable>
    </div>
  );
}
