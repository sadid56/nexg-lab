"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import Image from "next/image";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";

import { useKeywords } from "@/queries/actions/keywordsActions";
import { useCategories } from "@/queries/actions/categoryActions";
import { Keyword } from "@/types/keywords-types";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { convertToBase64 } from "@/utils/convertToBase64";
import { calculateReadTime } from "@/utils/calculateReadTimes";
import { toast } from "sonner";

export interface BlogFormValues {
  title: string;
  slug: string;
  descriptions: string;
  category: string;
  tags: string[];
  content: string;
  coverImage?: FileList;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormValues> & { coverImage?: string | null };
  onSubmit: (payload: any) => Promise<void>;
  submitText?: string;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onSubmit, submitText = "Publish Blog" }) => {
  const { data: keywords = [] } = useKeywords();
  const { data: categories = [] } = useCategories();

  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openTags, setOpenTags] = useState(false);

  const { register, control, handleSubmit, watch, setValue, getValues, reset } = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      descriptions: "",
      category: "",
      tags: [],
      content: "",
    },
  });

  /** hydrate form (edit mode) */
  useEffect(() => {
    if (!initialData) return;

    if (initialData.coverImage) {
      setExistingCoverImage(initialData.coverImage);
    }

    reset({
      title: initialData.title ?? "",
      slug: initialData.slug ?? "",
      descriptions: initialData.descriptions ?? "",
      category: initialData.category ?? "",
      tags: initialData.tags ?? [],
      content: initialData.content ?? "",
    });
  }, [initialData, reset]);

  /** submit handler */
  const handleFormSubmit = async (data: BlogFormValues) => {
    setLoading(true);
    try {
      let coverImage = existingCoverImage ?? undefined;

      const fileInput = getValues("coverImage");
      if (fileInput?.length) {
        coverImage = await convertToBase64(fileInput[0]);
      }

      const payload = {
        ...data,
        coverImage,
        readTime: calculateReadTime(data.content),
      };

      await onSubmit(payload);
    } catch {
      toast.error(initialData ? "Blog edit failed!" : "Blog post failed");
    } finally {
      setLoading(false);
    }
  };

  /** tags */
  const selectedTags = watch("tags");

  const toggleTag = (tag: string) => {
    const tags = getValues("tags");
    setValue("tags", tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]);
  };

  const removeTag = useCallback(
    (tag: string) => {
      setValue(
        "tags",
        getValues("tags").filter((t) => t !== tag)
      );
    },
    [getValues, setValue]
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='grid grid-cols-3 gap-6'>
      {/* LEFT */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
          </div>

          <div>
            <Label>Slug</Label>
            <Input {...register("slug")} />
          </div>

          <div>
            <Label>Description</Label>
            <textarea {...register("descriptions")} className='w-full rounded-md border p-2' rows={3} />
          </div>

          {/* cover */}
          <div>
            <Label>Cover Image</Label>
            {existingCoverImage && (
              <Image src={existingCoverImage} alt='Cover' width={800} height={400} className='mb-2 h-40 w-full rounded object-cover' />
            )}
            <Input type='file' accept='image/*' {...register("coverImage")} />
          </div>

          {/* category */}
          <div>
            <Label>Category</Label>
            <Controller
              name='category'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.title}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* tags */}
          <div>
            <Label>Tags</Label>
            <Popover open={openTags} onOpenChange={setOpenTags}>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-full'>
                  {selectedTags.length ? `${selectedTags.length} selected` : "Select tags"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className='p-0'>
                <Command>
                  <CommandInput placeholder='Search tags...' />
                  <CommandEmpty>No tags found</CommandEmpty>
                  <CommandGroup>
                    {keywords.map((k: Keyword) => {
                      const active = selectedTags.includes(k.title);
                      return (
                        <CommandItem key={k.id} onSelect={() => toggleTag(k.title)}>
                          <Check className={`mr-2 h-4 w-4 ${active ? "opacity-100" : "opacity-0"}`} />
                          {k.title}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <div className='mt-2 flex flex-wrap gap-2'>
              {selectedTags.map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                  <button type='button' onClick={() => removeTag(tag)} className='ml-1'>
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT */}
      <div className='col-span-2 space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Markdown Content</CardTitle>
            <p className='text-sm text-muted-foreground'>⏱ {calculateReadTime(watch("content"))} min read</p>
          </CardHeader>
          <CardContent>
            <MDEditor value={watch("content")} onChange={(v) => setValue("content", v ?? "")} height={500} />
          </CardContent>
        </Card>

        <Button disabled={loading} className='w-full' type='submit'>
          {loading ? "Saving..." : submitText}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
