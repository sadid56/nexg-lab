export const blogKeys = {
  all: ["blogs", "recent-blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (params?: unknown) => [...blogKeys.lists(), params] as const,
  detail: (id: string) => [...blogKeys.all, "detail", id] as const,
};
