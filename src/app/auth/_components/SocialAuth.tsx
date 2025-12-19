import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";

interface SocialAuthProps {
  setLoading: Dispatch<SetStateAction<boolean>>;
  callbackUrl: string;
  loading: boolean;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ setLoading, callbackUrl, loading }) => {
  async function socialSignup(provider: "google" | "github") {
    setLoading(true);
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
  }

  return (
    <div className='grid grid-cols-2 gap-3'>
      <Button
        type='button'
        variant='outline'
        className='h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80'
        onClick={() => socialSignup("google")}
        disabled={loading}
      >
        <IconBrandGoogle stroke={2} />
        Google
      </Button>

      <Button
        type='button'
        variant='outline'
        className='h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80'
        onClick={() => socialSignup("github")}
        disabled={loading}
      >
        <IconBrandGithub stroke={2} />
        GitHub
      </Button>
    </div>
  );
};

export default SocialAuth;
