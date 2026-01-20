import { Home, Users, BookOpen, Settings2, LucideIcon, MessageSquare, Mail, Layers, Tag } from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: NavItem[];
}

export interface NavConfig {
  navMain: NavItem[];
}
// Tech-blog-focused dashboard data
export const sidebarLinks: NavConfig = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "All Blogs",
      url: "/dashboard/blogs",
      icon: BookOpen,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Layers,
    },
    {
      title: "Keywords",
      url: "/dashboard/keywords",
      icon: Tag,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: MessageSquare,
    },
    {
      title: "Newsletter",
      url: "/dashboard/newsletter",
      icon: Mail,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
};
