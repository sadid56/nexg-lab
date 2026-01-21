import { fetcher } from "@/lib/fetcher";

export interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  activeBlogs: number;
  totalFeedbacks: number;
  monthlyTrend: { name: string; count: number }[];
  categoryDistribution: { name: string; value: number }[];
  recentBlogs: {
    id: string;
    title: string;
    slug: string;
    createdAt: string;
    status: string;
  }[];
  recentFeedbacks: {
    id: string;
    feedback: string;
    createdAt: string;
    post: { title: string };
  }[];
}

export const DashboardEndpoints = {
  getDashboardStats: () => fetcher<DashboardStats>("/api/dashboard/stats"),
};
