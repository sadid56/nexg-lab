import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

const useSignOut = () => {
  const qc = useQueryClient();
  const signout = async () => {
    await authClient.signOut();
    qc.invalidateQueries({ queryKey: ["user"] });
  };
  return { signout };
};

export default useSignOut;
