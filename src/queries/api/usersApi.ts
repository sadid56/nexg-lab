import { fetcher } from "@/lib/fetcher";
import { User } from "@/types/users-types";

export const getUsers = ({ search }: { search: string }) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  return fetcher<User[]>(`/api/users?${params.toString()}`);
};

export const getUser = (id: string) => fetcher<User[]>(`/api/users/${id}`);

export const deleteUser = (id: string) => fetcher<void>(`/api/users/${id}`, { method: "DELETE" });
