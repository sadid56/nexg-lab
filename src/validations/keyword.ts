// validations/keyword.ts
import { z } from "zod";

export const keywordFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
});

export type KeywordFormData = z.infer<typeof keywordFormSchema>;
