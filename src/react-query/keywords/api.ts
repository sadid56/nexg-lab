import { fetcher } from "@/lib/fetcher";
import { Keyword } from "@/types/keywords-types";

export const KeywordEndpoints = {
  getKeywords: () => fetcher<Keyword[]>("/api/keywords"),

  createKeyword: (data: Partial<Keyword>) => fetcher<Keyword>("/api/keywords", { method: "POST", body: JSON.stringify(data) }),

  updateKeyword: (id: string, data: Partial<Keyword>) =>
    fetcher<Keyword>(`/api/keywords/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteKeyword: (id: string) => fetcher<void>(`/api/keywords/${id}`, { method: "DELETE" }),
};
