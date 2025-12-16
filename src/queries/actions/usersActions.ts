import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/usersApi";
import { usersKeys } from "../keys/usersKeys";

export function useUsers({ search = "" }) {
  return useQuery({
    queryKey: usersKeys.lists(search),
    queryFn: () => api.getUsers({ search }),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => api.getUser(id),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });
}
