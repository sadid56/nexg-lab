import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";
import { FeedbackEndpoints } from "./api";
import { feedbackKeys } from "./keys";
import { Feedback } from "../../../prisma/generated/client";

export function useFeedbacks(params: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: feedbackKeys.lists(params),
    queryFn: () => FeedbackEndpoints.getFeedback(params),
  });
}

export function useSubmitFeedbacks() {
  return useAppMutation<Partial<Feedback>>({
    mutationFn: FeedbackEndpoints.submitFeedback,
    invalidateKeys: [["feedbacks"]],
    successMessage: "Feedback submitted successfully",
    errorMessage: "Failed to submit feedback",
  });
}

export function useDeleteFeedback() {
  return useAppMutation<string>({
    mutationFn: FeedbackEndpoints.deleteFeedback,
    invalidateKeys: [["feedbacks"]],
    successMessage: "Feedback deleted successfully",
    errorMessage: "Failed to delete feedback",
  });
}

export function useReplyToFeedback() {
  return useAppMutation<{ email: string; subject: string; body: string }>({
    mutationFn: FeedbackEndpoints.replyToFeedback,
    successMessage: "Reply sent successfully",
    errorMessage: "Failed to send reply",
  });
}
