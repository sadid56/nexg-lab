export const usersKeys = {
  all: ["users"] as const,
  lists: (list: any) => [...list, "users"] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
};
