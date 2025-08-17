"use client";

import * as React from "react";
import { BookOpen, Bot, Frame, Settings2, SquareTerminal } from "lucide-react";

import { NavWithDropDowns } from "@/components/sidebar/nav-with-dropdowns";
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

// This is sample data.
const data = {
  main: [
    {
      name: "Dashboard",
      url: "#",
      icon: Frame,
    },
  ],
  management: [
    {
      title: "Shop Management",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "All Shops",
          url: ROUTES.SHOP,
        },
        {
          title: "Add new shop",
          url: ROUTES.SHOP_ADD,
        },
      ],
    },
    {
      title: "Category",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "All Categories",
          url: ROUTES.CATEGORY,
        },
        {
          title: "Add Category",
          url: ROUTES.CATEGORY_ADD,
        },
      ],
    },
    {
      title: "Product Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All Products",
          url: "#",
        },
        {
          title: "My Draft Products",
          url: "#",
        },
        {
          title: "Low and Finished Products",
          url: "#",
        },
      ],
    },
    {
      title: "User Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "All users",
          url: "#",
        },
        {
          title: "Customers",
          url: "#",
        },
        {
          title: "Staff",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Payment",
          url: "#",
        },
        {
          title: "Company Info",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>Billy Store</SidebarHeader>
      <SidebarContent>
        <NavSingles headerTitle="Main" items={data.main} />
        <NavWithDropDowns headerTitle="Management" items={data.management} />
        {/* <NavSingles items={data.others} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
