"use client";

import * as React from "react";
import { Home, Users, BookOpen, PlusSquare, BarChart2, Tags, MessageCircle, Settings2 } from "lucide-react";

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavMain } from "../ui/nav-main";

// Tech-blog-focused dashboard data
const data = {
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
          title: "All Blogs",
          url: "/dashboard/blogs",
        },
        {
          title: "Create Blog",
          url: "/dashboard/blogs/create",
          icon: PlusSquare,
        },
        {
          title: "Categories",
          url: "/dashboard/blogs/categories",
          icon: Tags,
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

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <h2>Sadid</h2>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
