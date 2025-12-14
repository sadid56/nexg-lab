import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url === pathname || item.items?.some((subItem) => subItem.url === pathname);

          if (item.items && item.items.length > 0) {
            // Render collapsible menu
            return (
              <Collapsible key={item.title} asChild defaultOpen={isActive} className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={`cursor-pointer ${isActive ? "bg-orange-500 text-white" : ""}`} tooltip={item.title}>
                      {item.icon && <item.icon className='mr-2' />}
                      <span>{item.title}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive = subItem.url === pathname;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url} className={`${isSubActive ? "bg-orange-500 text-white" : ""}`}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          } else {
            // Render normal link button
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className={`cursor-pointer ${isActive ? "bg-orange-500 text-white" : ""}`}>
                  <Link href={item.url}>
                    {item.icon && <item.icon className='mr-2' />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
