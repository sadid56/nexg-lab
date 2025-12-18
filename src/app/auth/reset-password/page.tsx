import { Metadata } from "next";
import ResetPasswordContent from "../_components/ResetPasswordContent";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "NexG Lab — Reset Password",
    template: "%s | NexG Lab Blog",
  },

  description:
    "NexG Lab Blog shares practical tutorials, deep dives, and real-world insights on web development, JavaScript, React, Next.js, backend engineering, and modern software architecture.",

  keywords: [
    "web development blog",
    "javascript tutorials",
    "react blog",
    "next.js blog",
    "frontend development",
    "backend engineering",
    "full stack development",
    "programming tutorials",
    "software engineering",
    "developer blog",
    "linux",
  ],

  authors: [{ name: "NexG Lab" }],
  creator: "NexG Lab",
  publisher: "NexG Lab",

  metadataBase: new URL(process.env.BETTER_AUTH_URL!),

  openGraph: {
    title: "NexG Lab Blog — Web Development & Engineering",
    description: "Practical tutorials and engineering insights on React, Next.js, JavaScript, backend systems, and modern web development.",
    url: process.env.BETTER_AUTH_URL,
    siteName: "NexG Lab Blog",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NexG Lab Blog — Web Development & Engineering",
    description: "Tutorials, guides, and real-world lessons on React, Next.js, JavaScript, and full-stack development.",
  },

  alternates: {
    canonical: process.env.BETTER_AUTH_URL,
  },

  robots: {
    index: true,
    follow: true,
  },
};

const ResetPasswordPage = () => {
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
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
