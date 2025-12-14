import { Status } from "@/theme/status-badge";
import { z } from "zod";

export const categoryFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(50, { message: "Title must be less than 50 characters" }),
  slug: z
    .string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .max(50, { message: "Slug must be less than 50 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" })
    .optional()
    .or(z.literal("")),
  status: z.enum(Object.values(Status) as [Status, ...Status[]]),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
