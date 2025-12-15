/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, MoveUp, MoveDown, Upload, X, Check } from "lucide-react";
import { toast } from "sonner";
import { BlogRootSettings, BlogSection, SectionBlock, SectionBlockType } from "@/types/blog-types";
import { useKeywords } from "@/queries/actions/keywordsActions";
import { useCategories } from "@/queries/actions/categoryActions";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUpdateBlog, useGetBlogById } from "@/queries/actions/blogActions";
import { Keyword } from "@/types/keywords-types";
import { convertToBase64 } from "@/utils/convertToBase64";
import Image from "next/image";

interface EditBlogForm {
  root: BlogRootSettings;
  sections: BlogSection[];
}

interface EditBlogProps {
  blogId: string;
}

const EditBlog: React.FC<EditBlogProps> = ({ blogId }) => {
  const { data: keywords = [] } = useKeywords();
  const { data: categories = [] } = useCategories();
  const { data: blog, isLoading: isBlogLoading } = useGetBlogById(blogId) as any;
  const updateBlog = useUpdateBlog();
  const [openTagsDropdown, setOpenTagsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingCoverImage, setExistingCoverImage] = useState<string | null>(null);

  const { register, control, handleSubmit, watch, setValue, getValues, reset } = useForm<EditBlogForm>({
    defaultValues: {
      root: {
        title: "",
        slug: "",
        descriptions: "",
        category: "",
        tags: [],
      },
      sections: [],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
    move: moveSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  // Load blog data as default values
  useEffect(() => {
    if (!blog || categories.length === 0) return;

    const root = blog.root;

    if (root?.coverImage) {
      setExistingCoverImage(root.coverImage);
    }

    reset({
      root: {
        title: root.title ?? "",
        slug: root.slug ?? "",
        descriptions: root.descriptions ?? "",
        category: root.category ?? "",
        tags: root.tags ?? [],
      },
      sections: blog.sections ?? [],
    });
  }, [blog, categories, reset]);

  const onSubmit = async (data: EditBlogForm) => {
    setLoading(true);
    try {
      // Handle cover image upload if new file selected
      let coverImageToSend: string | undefined = existingCoverImage || undefined;

      const fileInput = getValues("root.coverImage");
      //@ts-ignore
      if (fileInput && fileInput?.length > 0) {
        //@ts-ignore
        const file = fileInput[0];
        coverImageToSend = await convertToBase64(file as File);
      }

      const payload = {
        root: {
          ...data.root,
          coverImage: coverImageToSend,
        },
        sections: data.sections,
      };

      await updateBlog.mutateAsync({ id: blogId, data: payload });
      toast.success("Blog updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    const currentTags = getValues("root.tags");
    if (currentTags.includes(tag)) {
      setValue(
        "root.tags",
        currentTags.filter((t) => t !== tag)
      );
    } else {
      setValue("root.tags", [...currentTags, tag]);
    }
  };

  const removeTag = useCallback(
    (tag: string) => {
      setValue(
        "root.tags",
        getValues("root.tags").filter((t) => t !== tag)
      );
    },
    [getValues, setValue]
  );

  const addBlock = (sectionIndex: number, type: SectionBlockType) => {
    const blocks = watch(`sections.${sectionIndex}.blocks`) || [];
    const newBlock: SectionBlock = { type };
    setValue(`sections.${sectionIndex}.blocks`, [...blocks, newBlock]);
  };

  const selectedTags = watch("root.tags");

  if (isBlogLoading) return <div className='text-center mt-20'>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-3 gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Title */}
          <div>
            <Label>Blog Title</Label>
            <Input {...register("root.title")} placeholder='Enter blog title' />
          </div>

          {/* Slug */}
          <div>
            <Label>Blog Slug</Label>
            <Input {...register("root.slug")} placeholder='blog-slug' />
          </div>

          {/* Descriptions */}
          <div>
            <Label>Short Descriptions</Label>
            <textarea {...register("root.descriptions")} className='w-full border rounded-md p-2' rows={3} />
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            {existingCoverImage && (
              <div className='mb-2'>
                <Image width={800} height={500} src={existingCoverImage} alt='Current Cover' className='h-40 w-full object-cover rounded' />
                <p className='text-sm text-gray-500 mt-1'>Current cover image</p>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <Input type='file' accept='image/*' {...register("root.coverImage")} />
              <Upload className='w-4 h-4' />
            </div>
            <p className='text-xs text-gray-500 mt-1'>Upload a new image to replace the current one</p>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Controller
              name='root.category'
              control={control}
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
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

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <Popover open={openTagsDropdown} onOpenChange={setOpenTagsDropdown}>
              <PopoverTrigger asChild>
                <Button type='button' variant='outline' role='combobox' className='w-full justify-between'>
                  {selectedTags?.length > 0 ? `${selectedTags.length} tag(s) selected` : "Select tags"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command>
                  <CommandInput placeholder='Search tags...' />
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup className='max-h-64 overflow-auto'>
                    {keywords.map((keyword: Keyword) => {
                      const isSelected = selectedTags?.includes(keyword.title);
                      return (
                        <CommandItem key={keyword.id} onSelect={() => toggleTag(keyword.title)}>
                          <div
                            className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                              isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                            }`}
                          >
                            {isSelected && <Check className='h-3 w-3' />}
                          </div>
                          {keyword.title}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <div className='flex flex-wrap gap-2 mt-2'>
              {selectedTags?.map((tag) => (
                <Badge key={tag} variant='secondary' className='gap-1'>
                  {tag}
                  <button type='button' onClick={() => removeTag(tag)} className='ml-1 hover:text-destructive'>
                    <X className='w-3 h-3' />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className='col-span-2 space-y-6'>
        {sectionFields.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className='flex flex-row justify-between'>
              <CardTitle>Section {index + 1}</CardTitle>
              <div className='flex gap-2'>
                <Button type='button' variant='outline' size='icon' onClick={() => moveSection(index, index - 1)} disabled={index === 0}>
                  <MoveUp className='w-4 h-4' />
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => moveSection(index, index + 1)}
                  disabled={index === sectionFields.length - 1}
                >
                  <MoveDown className='w-4 h-4' />
                </Button>
                <Button type='button' variant='destructive' size='icon' onClick={() => removeSection(index)}>
                  <Trash className='w-4 h-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Label>Markdown Content</Label>
              <MDEditor
                value={watch(`sections.${index}.markdown`)}
                onChange={(val) => setValue(`sections.${index}.markdown`, val || "")}
                height={300}
              />

              <div className='flex gap-2 mt-4 flex-wrap'>
                <Button type='button' onClick={() => addBlock(index, "info")} variant='outline'>
                  Add Info
                </Button>
                <Button type='button' onClick={() => addBlock(index, "warning")} variant='outline'>
                  Add Warning
                </Button>
                <Button type='button' onClick={() => addBlock(index, "error")} variant='outline'>
                  Add Error
                </Button>
                <Button type='button' onClick={() => addBlock(index, "tips")} variant='outline'>
                  Add Tips
                </Button>
              </div>

              {watch(`sections.${index}.blocks`)?.map((block, blockIndex) => (
                <div key={blockIndex} className='border p-3 rounded-md space-y-2'>
                  <div className='flex justify-between'>
                    <Label className='font-semibold uppercase'>{block.type} Block</Label>
                    <Button
                      type='button'
                      size='icon'
                      variant='destructive'
                      onClick={() => {
                        const blocks = watch(`sections.${index}.blocks`);
                        blocks.splice(blockIndex, 1);
                        setValue(`sections.${index}.blocks`, [...blocks]);
                      }}
                    >
                      <Trash className='w-4 h-4' />
                    </Button>
                  </div>
                  <textarea
                    {...register(`sections.${index}.blocks.${blockIndex}.content`)}
                    className='w-full border rounded-md p-2'
                    placeholder={`Write ${block.type} message`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          type='button'
          onClick={() =>
            appendSection({
              markdown: "",
              blocks: [],
            })
          }
        >
          <Plus className='w-4 h-4' />
          Add New Section
        </Button>

        <Button disabled={loading} className='w-full mt-4' type='submit'>
          {loading ? "Updating..." : "Update Blog"}
        </Button>
      </div>
    </form>
  );
};

export default EditBlog;
