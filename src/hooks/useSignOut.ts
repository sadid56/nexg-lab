import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useSignOut = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const signout = async () => {
    await authClient.signOut();
    router.refresh();
    qc.invalidateQueries({ queryKey: ["user"] });
  };
  return { signout };
};

export default useSignOut;
