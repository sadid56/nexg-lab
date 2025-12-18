"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { CheckUser } from "@/actions/auth-actions";
import Link from "next/link";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const ResetPasswordContent: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const form = useForm<EmailForm | PasswordForm>({
    resolver: zodResolver(token ? passwordSchema : emailSchema),
    defaultValues: token ? { password: "", confirmPassword: "" } : { email: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = async (values: EmailForm | PasswordForm) => {
    try {
      if (!token) {
        const result = await CheckUser((values as EmailForm).email);
        if (!result.success) {
          return toast.warning("User not found. Please check your email!");
        }

        await authClient.requestPasswordReset({
          email: (values as EmailForm).email,
          redirectTo: `/auth/reset-password?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        });

        toast.success("Reset link sent to your email");
        reset();
        return;
      }

      const { data } = await authClient.resetPassword({
        newPassword: (values as PasswordForm).password,
        token,
      });

      if (data?.status) {
        toast.success("Password reset successful");
        reset();
        router.push(`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <Card className='w-full max-w-md rounded-2xl shadow-lg'>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-2xl font-bold'>{token ? "Set new password" : "Reset password"}</CardTitle>
          <CardDescription>{token ? "Enter your new password below" : "Enter your email to receive a reset link"}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email Input */}
            {!token && (
              <div className='space-y-1'>
                <label className='text-sm font-medium'>Email</label>
                <Input type='email' placeholder='you@example.com' {...register("email")} />
                {emailForm.formState.errors.email && <p>{emailForm.formState.errors.email.message}</p>}
              </div>
            )}

            {/* New Password */}
            {token && (
              <>
                <div className='space-y-1'>
                  <label className='text-sm font-medium'>New password</label>
                  <Input type='password' {...register("password")} />
                  {passwordForm.formState.errors.password && <p>{passwordForm.formState.errors.password.message}</p>}
                </div>

                <div className='space-y-1'>
                  <label className='text-sm font-medium'>Confirm password</label>
                  <Input type='password' {...register("confirmPassword")} />
                  {passwordForm.formState.errors.confirmPassword && <p>{passwordForm.formState.errors.confirmPassword.message}</p>}
                </div>
              </>
            )}

            <Button className='w-full' disabled={isSubmitting}>
              {token ? "Reset password" : "Send reset link"}
            </Button>
            <h5 className='text-sm text-center'>
              Remember Password ?{" "}
              <Link
                className='hover:underline text-blue-400 font-medium'
                href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              >
                Back to sign-in
              </Link>
            </h5>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordContent;
