import { fetcher } from "@/lib/fetcher";
import { Keyword } from "@/types/keywords-types";

export const getKeywords = () => fetcher<Keyword[]>("/api/keywords");

export const createKeyword = (data: Partial<Keyword>) => fetcher<Keyword>("/api/keywords", { method: "POST", body: JSON.stringify(data) });

export const updateKeyword = (id: string, data: Partial<Keyword>) =>
  fetcher<Keyword>(`/api/keywords/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteKeyword = (id: string) => fetcher<void>(`/api/keywords/${id}`, { method: "DELETE" });
