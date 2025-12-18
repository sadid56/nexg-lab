import { fetcher } from "@/lib/fetcher";
import { Feedback } from "../../../prisma/generated/client";

export const getFeedback = () => fetcher<Feedback[]>("/api/feedbacks");

export const submitFeedback = (data: Partial<Feedback>) =>
  fetcher<Feedback>("/api/feedbacks", { method: "POST", body: JSON.stringify(data) });
