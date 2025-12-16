"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950'>
          <div className='animate-pulse flex flex-col items-center'>
            <div className='h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4' />
            <div className='h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded'></div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  // const error = searchParams?.get("error");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await authClient.signIn.email({
      email: form.email,
      password: form.password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setErrorMsg(error.message || "Invalid credentials. Please try again.");
    }
    setLoading(false);
  }

  async function socialLogin(provider: "google" | "github") {
    setLoading(true);
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900'>
      {/* Background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent dark:via-gray-800/20' />
      </div>

      <div className='relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8'>
        {/* Header */}
        <div className='w-full max-w-md mb-8 text-center'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <div className='h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
              <Shield className='h-6 w-6 text-white' />
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent'>
              PropfirmRankings
            </h1>
          </div>
          <p className='text-gray-600 dark:text-gray-400'>Secure trading analytics platform</p>
        </div>

        {/* Login Card */}
        <div className='w-full max-w-md'>
          <Card className='relative overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl'>
            {/* Card accent */}
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600' />

            <CardHeader className='space-y-2 text-center'>
              <CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Welcome Back</CardTitle>
            </CardHeader>

            <CardContent className='space-y-6'>
              {errorMsg && (
                <Alert variant='destructive' className='border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'>
                  <AlertDescription className='text-red-800 dark:text-red-300'>{errorMsg}</AlertDescription>
                </Alert>
              )}

              {/* Social Auth */}
              <div className='space-y-3'>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <Separator className='w-full' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>Quick sign in</span>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    className='h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                    onClick={() => socialLogin("google")}
                    disabled={loading}
                  >
                    {/* <Chromium className='mr-2 h-4 w-4' /> */}
                    Google
                  </Button>

                  <Button
                    type='button'
                    variant='outline'
                    className='h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                    onClick={() => socialLogin("github")}
                    disabled={loading}
                  >
                    {/* <Github className='mr-2 h-4 w-4' /> */}
                    GitHub
                  </Button>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-gray-700 dark:text-gray-300'>
                    Email Address
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className='pl-10 h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400'
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label htmlFor='password' className='text-gray-700 dark:text-gray-300'>
                      Password
                    </Label>
                    <Link href='/reset-password' className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
                      Forgot password?
                    </Link>
                  </div>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <Input
                      id='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='Enter your password'
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className='pl-10 pr-10 h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400'
                      disabled={loading}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className='h-4 w-4 text-gray-400' /> : <Eye className='h-4 w-4 text-gray-400' />}
                    </Button>
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </form>

              {/* Security Note */}
              <div className='rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 p-3'>
                <div className='flex items-start gap-2'>
                  <Shield className='h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5' />
                  <p className='text-xs text-blue-800 dark:text-blue-300'>
                    Your data is protected with enterprise-grade security and encryption.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Don&apos;t have an account?{" "}
                <Link
                  href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className='font-semibold text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Create account
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Footer */}
          <div className='mt-8 text-center text-xs text-gray-500 dark:text-gray-400'>
            <p>
              By continuing, you agree to our{" "}
              <Link href='/terms' className='underline hover:text-gray-700 dark:hover:text-gray-300'>
                Terms
              </Link>{" "}
              and{" "}
              <Link href='/privacy' className='underline hover:text-gray-700 dark:hover:text-gray-300'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
