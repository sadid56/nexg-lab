export const newsletterKeys = {
  all: ["newsletter"] as const,
  lists: (params: any) => [...newsletterKeys.all, "list", params] as const,
};
