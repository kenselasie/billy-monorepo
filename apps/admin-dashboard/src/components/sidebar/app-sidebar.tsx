"use client";

import * as React from "react";
import { BookOpen, Bot, Frame, Settings2, SquareTerminal } from "lucide-react";

import { NavSingles } from "@/components/sidebar/nav-singles";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ROUTES } from "@/const/routes";

// Flattened navigation data without nested routes
const navigationItems = [
  {
    name: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: Frame,
  },
  {
    name: "All Shops",
    url: ROUTES.SHOP,
    icon: SquareTerminal,
  },
  {
    name: "Add Shop",
    url: ROUTES.SHOP_ADD,
    icon: SquareTerminal,
  },
  {
    name: "Categories",
    url: ROUTES.CATEGORY,
    icon: BookOpen,
  },
  {
    name: "Add Category",
    url: ROUTES.CATEGORY_ADD,
    icon: BookOpen,
  },
  {
    name: "Products",
    url: "#",
    icon: Bot,
  },
  {
    name: "Users",
    url: "#",
    icon: BookOpen,
  },
  {
    name: "Settings",
    url: "#",
    icon: Settings2,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="font-semibold text-lg text-sidebar-foreground">Billy Store</h1>
            <p className="text-xs text-sidebar-foreground/70">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavSingles items={navigationItems} />
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
