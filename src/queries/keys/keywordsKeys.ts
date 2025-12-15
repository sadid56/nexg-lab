export const keywordsKeys = {
  all: ["keywords"] as const,
  lists: () => [...keywordsKeys.all, "list"] as const,
  list: (params?: unknown) => [...keywordsKeys.lists(), params] as const,
  detail: (id: string) => [...keywordsKeys.all, "detail", id] as const,
};
