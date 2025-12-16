"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Github, Mail } from "lucide-react";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className='h-screen grid place-items-center'>Loading…</div>}>
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [resending, setResending] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    setLoading(true);
    setEmail(form.email);

    const { error } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setVerifyOpen(true);
    }

    setLoading(false);
  }

  async function socialSignup(provider: "google" | "github") {
    setLoading(true);
    await authClient.signIn.social({
      provider,
      callbackURL: callbackUrl,
    });
  }

  async function resendVerification() {
    setResending(true);
    await authClient.sendVerificationEmail({ email });
    setResending(false);
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <Card className='w-full max-w-md bg-zinc-900 border-zinc-800'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold'>Create account</CardTitle>
          <CardDescription>Join PropfirmRankings in seconds</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {errorMsg && (
            <Alert variant='destructive'>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {/* Social signup */}
          <div className='space-y-2'>
            <Button variant='outline' className='w-full' onClick={() => socialSignup("google")} disabled={loading}>
              <Mail className='mr-2 h-4 w-4' />
              Continue with Google
            </Button>

            <Button variant='outline' className='w-full' onClick={() => socialSignup("github")} disabled={loading}>
              <Github className='mr-2 h-4 w-4' />
              Continue with GitHub
            </Button>
          </div>

          <Separator />

          {/* Email signup */}
          <form onSubmit={handleSignup} className='space-y-3'>
            <Input placeholder='Full name' required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <Input
              type='email'
              placeholder='Email'
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              type='password'
              placeholder='Password'
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type='submit' className='w-full' disabled={loading}>
              Create account
            </Button>
          </form>

          <p className='text-sm text-center text-muted-foreground'>
            Already have an account?{" "}
            <Link href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`} className='underline'>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Email verification dialog */}
      <Dialog open={verifyOpen} onOpenChange={setVerifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
          </DialogHeader>

          <p className='text-sm text-muted-foreground'>
            We sent a verification link to <strong>{email}</strong>. Please check your inbox to activate your account.
          </p>

          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setVerifyOpen(false)}>
              Close
            </Button>
            <Button loading={resending} onClick={resendVerification}>
              Resend email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
