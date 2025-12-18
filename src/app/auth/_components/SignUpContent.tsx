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
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import SocialAuth from "./SocialAuth";

export default function SignUpContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setErrorMsg(error.message || "Failed to create account. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className='min-h-screen relative overflow-hidden dark:from-gray-900 dark:via-gray-950 dark:to-gray-900'>
      <div className='relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8'>
        {/* Sign Up Card */}
        <div className='w-full max-w-md'>
          <Card className='relative overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl'>
            {/* Card accent */}
            <div className='absolute top-0 left-0 w-full h-1 bg-orange-400' />

            <CardHeader className='space-y-2 text-center'>
              <CardTitle className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Create Account</CardTitle>
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
                    <span className='bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400'>Quick signup</span>
                  </div>
                </div>

                <SocialAuth setLoading={setLoading} loading={loading} callbackUrl={callbackUrl} />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignup} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='text-gray-700 dark:text-gray-300'>
                    Full Name
                  </Label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Your full name'
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className='h-11 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400'
                    disabled={loading}
                  />
                </div>

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
                  <Label htmlFor='password' className='text-gray-700 dark:text-gray-300'>
                    Password
                  </Label>
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
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full h-11 cursor-pointer text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-amber-500 hover:bg-amber-600'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Signing up...
                    </>
                  ) : (
                    <>
                      Sign up
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
                Already have an account?{" "}
                <Link
                  href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className='font-semibold text-blue-600 dark:text-blue-400 hover:underline'
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
