import { Metadata } from "next";
import ResetPasswordContent from "../_components/ResetPasswordContent";

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
    <div>
      <ResetPasswordContent />
    </div>
  );
};

export default ResetPasswordPage;
