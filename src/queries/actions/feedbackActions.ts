import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/feedbackApi";
import { feedbackKeys } from "../keys/feedbackKeys";

export function useFeedbacks() {
  return useQuery({
    queryKey: feedbackKeys.lists(),
    queryFn: api.getFeedback,
  });
}

export function useSubmitFeedbacks() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.submitFeedback,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: feedbackKeys.all,
      });
    },
  });
}
