"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavSingles({
  headerTitle,
  items,
}: {
  headerTitle?: string;
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {headerTitle && <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">{headerTitle}</SidebarGroupLabel>}
      <SidebarMenu className="space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.url;
          
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                tooltip={item.name} 
                isActive={isActive}
                size="lg"
                className={isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border-l-4 border-primary" : ""}
              >
                <Link href={item.url} className="flex items-center gap-3 py-3">
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden text-sm">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
