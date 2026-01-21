import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";
import { NewsletterEndpoints } from "./api";
import { newsletterKeys } from "./keys";

export function useNewsletters(params: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: newsletterKeys.lists(params),
    queryFn: () => NewsletterEndpoints.getNewsletters(params),
  });
}

export function useDeleteNewsletter() {
  return useAppMutation<string>({
    mutationFn: NewsletterEndpoints.deleteNewsletter,
    invalidateKeys: [["newsletter"]],
    successMessage: "Newsletter entry deleted successfully",
    errorMessage: "Failed to delete newsletter entry",
  });
}
