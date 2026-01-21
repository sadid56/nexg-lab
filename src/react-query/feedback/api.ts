import { fetcher } from "@/lib/fetcher";
import { Feedback } from "../../../prisma/generated/client";

export const FeedbackEndpoints = {
  getFeedback: (params: { search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    return fetcher<any>(`/api/feedbacks?${query.toString()}`);
  },

  submitFeedback: (data: Partial<Feedback>) => fetcher<Feedback>("/api/feedbacks", { method: "POST", body: JSON.stringify(data) }),

  deleteFeedback: (id: string) => fetcher(`/api/feedbacks?id=${id}`, { method: "DELETE" }),

  replyToFeedback: (data: { email: string; subject: string; body: string }) =>
    fetcher("/api/feedbacks/reply", { method: "POST", body: JSON.stringify(data) }),
};
