import z from "zod";

export const feedbackSchema = z.object({
  emoji: z.string().min(1, "Please select an emoji"),
  feedback: z.string().optional(),
});
