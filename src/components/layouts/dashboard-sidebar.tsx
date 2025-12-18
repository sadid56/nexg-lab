"use client";

import * as React from "react";

import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { NavMain } from "../ui/nav-main";
import { sidebarLinks } from "@/constants/sidebarLinks";
import Link from "next/link";

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Link className='font-medium text-xl pl-2 py-3' href={"/"}>
          {state === "collapsed" ? "D" : "Dashboard"}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarLinks.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
