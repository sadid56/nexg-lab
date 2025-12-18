export const categoryKeys = {
  all: ["categories", "home-category"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: unknown) => [...categoryKeys.lists(), params] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};
