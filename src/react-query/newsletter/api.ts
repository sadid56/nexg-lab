import { fetcher } from "@/lib/fetcher";

export interface Newsletter {
  id: string;
  email: string;
  userId?: string;
  createdAt: string;
  user?: {
    name: string;
    image?: string;
  };
}

export interface NewsletterResponse {
  items: Newsletter[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const NewsletterEndpoints = {
  getNewsletters: (params: { search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    return fetcher<NewsletterResponse>(`/api/newsletter?${query.toString()}`);
  },

  deleteNewsletter: (id: string) => fetcher(`/api/newsletter?id=${id}`, { method: "DELETE" }),
};
