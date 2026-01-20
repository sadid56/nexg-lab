export const feedbackKeys = {
  all: ["feedbacks"] as const,
  lists: (params: any) => [...feedbackKeys.all, "list", params] as const,
};
