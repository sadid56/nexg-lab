"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import MDEditor from "@uiw/react-md-editor";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, MoveUp, MoveDown, Upload } from "lucide-react";
import axios from "axios";

import { BlogRootSettings, BlogSection, SectionBlock, SectionBlockType } from "@/types/blog-types";
import { toast } from "sonner";

interface BlogForm {
  root: BlogRootSettings;
  sections: BlogSection[];
}

const BlogEditor = () => {
  const { register, control, handleSubmit, watch, setValue, getValues } = useForm<BlogForm>({
    defaultValues: {
      root: {
        title: "",
        descriptions: "",
        category: "technology",
        tags: [],
      },
      sections: [
        {
          markdown: "",
          blocks: [],
        },
      ],
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
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: BlogForm) => {
    const mainData = {
      coverImage: data?.root.coverImage,
      category: data?.root?.category,
      tags: data?.root?.tags,
      descriptions: data?.root?.descriptions,
      title: data?.root?.title,
      slug: "what-next",
      sections: [...data.sections],
    };
    setLoading(true);
    try {
      const res = await axios.post("/api/blogs", mainData);
      if (res.status === 201) {
        toast.success("Successfully post your blog");
      }
    } catch (err) {
      console.log(err);
      toast.error("Blog Post failed.");
    } finally {
      setLoading(false);
    }
  };

  // Tag handling
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (!tagInput) return;
    const existing = getValues("root.tags");
    if (existing.includes(tagInput)) return;
    setValue("root.tags", [...existing, tagInput]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue(
      "root.tags",
      getValues("root.tags").filter((t) => t !== tag)
    );
  };

  // Add block inside section
  const addBlock = (sectionIndex: number, type: SectionBlockType) => {
    const blocks = watch(`sections.${sectionIndex}.blocks`) || [];
    const newBlock: SectionBlock = { type };
    setValue(`sections.${sectionIndex}.blocks`, [...blocks, newBlock]);
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* LEFT: BLOG ROOT SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Settings</CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Title */}
          <div>
            <Label>Blog Title</Label>
            <Input {...register("root.title")} placeholder='Write blog title' />
          </div>

          {/* descriptions */}
          <div>
            <Label>Short descriptions</Label>
            <textarea
              {...register("root.descriptions")}
              className='w-full rounded-md border p-2 text-sm'
              placeholder='Brief description...'
            />
          </div>

          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            <div className='flex items-center gap-2'>
              <Input type='file' accept='image/*' {...register("root.coverImage")} />
              <Upload className='w-4 h-4' />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Input {...register("root.category")} placeholder='technology' />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className='flex gap-2'>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder='Add tag'
              />
              <Button type='button' onClick={addTag}>
                <Plus className='w-4 h-4' />
              </Button>
            </div>

            <div className='flex flex-wrap gap-2 mt-2'>
              {watch("root.tags").map((tag) => (
                <Badge key={tag} variant='secondary' className='gap-1'>
                  {tag}
                  <button onClick={() => removeTag(tag)}>×</button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SECTION EDITOR */}
      <div className='col-span-2 space-y-6'>
        {sectionFields.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className='flex flex-row justify-between'>
              <CardTitle>Section {index + 1}</CardTitle>

              <div className='flex gap-2'>
                <Button variant='outline' size='icon' onClick={() => moveSection(index, index - 1)} disabled={index === 0}>
                  <MoveUp className='w-4 h-4' />
                </Button>

                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => moveSection(index, index + 1)}
                  disabled={index === sectionFields.length - 1}
                >
                  <MoveDown className='w-4 h-4' />
                </Button>

                <Button variant='destructive' size='icon' onClick={() => removeSection(index)}>
                  <Trash className='w-4 h-4' />
                </Button>
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              {/* Markdown Editor */}
              <Label>Markdown Content</Label>
              <MDEditor
                value={watch(`sections.${index}.markdown`)}
                onChange={(val) => setValue(`sections.${index}.markdown`, val || "")}
                height={300}
              />

              {/* BLOCK BUTTONS */}
              <div className='flex gap-2 mt-4 flex-wrap'>
                <Button onClick={() => addBlock(index, "info")} variant='outline'>
                  Add Info
                </Button>
                <Button onClick={() => addBlock(index, "warning")} variant='outline'>
                  Add Warning
                </Button>
                <Button onClick={() => addBlock(index, "error")} variant='outline'>
                  Add Error
                </Button>
                <Button onClick={() => addBlock(index, "tips")} variant='outline'>
                  Add Tips
                </Button>
              </div>

              {/* BLOCK LIST */}
              {watch(`sections.${index}.blocks`)?.map((block, blockIndex) => (
                <div key={blockIndex} className='border p-3 rounded-md space-y-2'>
                  <div className='flex justify-between'>
                    <Label className='font-semibold uppercase'>{block.type} Block</Label>
                    <Button
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

                  {(block.type === "info" || block.type === "warning" || block.type === "error") && (
                    <textarea
                      {...register(`sections.${index}.blocks.${blockIndex}.content`)}
                      className='w-full border rounded-md p-2'
                      placeholder={`Write ${block.type} message`}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={() =>
            appendSection({
              markdown: "",
              blocks: [],
            })
          }
        >
          <Plus className='w-4 h-4' /> Add New Section
        </Button>

        <Button disabled={loading} className='w-full' onClick={handleSubmit(onSubmit)}>
          {loading ? "loading..." : "Save Blog"}
        </Button>
      </div>
    </div>
  );
};

export default BlogEditor;
