import { useQuery } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/useAppMutation";
import { UserEndpoints } from "./api";
import { usersKeys } from "./keys";

export function useUsers({ search = "" }) {
  return useQuery({
    queryKey: usersKeys.lists(search),
    queryFn: () => UserEndpoints.getUsers({ search }),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => UserEndpoints.getUser(id),
  });
}

export function useDeleteUser() {
  return useAppMutation<string>({
    mutationFn: UserEndpoints.deleteUser,
    invalidateKeys: [["users"]],
    successMessage: "User deleted successfully",
    errorMessage: "Failed to delete user",
  });
}
