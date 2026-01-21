import { fetcher } from "@/lib/fetcher";
import { User } from "@/types/users-types";

export const UserEndpoints = {
  getUsers: ({ search }: { search: string }) => {
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    return fetcher<User[]>(`/api/users?${params.toString()}`);
  },

  getUser: (id: string) => fetcher<User>(`/api/users/${id}`),

  deleteUser: (id: string) => fetcher<void>(`/api/users/${id}`, { method: "DELETE" }),
};
