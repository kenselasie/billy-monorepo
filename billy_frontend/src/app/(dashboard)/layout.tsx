import * as React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RequiresAuth from "@/components/requires/requiresAuth";
import { SiteHeader } from "@/components/header/site-header";

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <RequiresAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </RequiresAuth>
  );
};

export default DashboardLayout;
