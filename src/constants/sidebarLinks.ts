import { Home, Users, BookOpen, Settings2, LucideIcon } from "lucide-react";

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
      title: "Blogs",
      url: "/dashboard/blogs",
      icon: BookOpen,
      items: [
        {
          title: "- All Blogs",
          url: "/dashboard/blogs",
        },
        {
          title: "- Create Blog",
          url: "/dashboard/blogs/create",
        },
        {
          title: "- Categories",
          url: "/dashboard/blogs/categories",
        },
        {
          title: "- Keywords",
          url: "/dashboard/keyboards",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
      ],
    },
  ],
};
