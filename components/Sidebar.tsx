"use client"; // Mark this component as a Client Component

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import { supabase } from "@/utils/supabase/client"; // Import Supabase client

const data = {
  navMain: [
    { title: "Dashboard", url: "/admin/dashboard" },
    { title: "All Users", url: "/admin/all-users" },
    { title: "Manage Campaigns", url: "/admin/CampaignsManagement" },
    { title: "Alerts", url: "/admin/Alerts" },
    { title: "Resource Management", url: "/admin/resource-management" },
    { title: "Verify Doctors", url: "/admin/verify-doctors" },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Redirect to login page or home page after logout
      window.location.href = "/sign-in"; // Adjust the redirect path as needed
    } catch (error: any) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-0 relative h-full">
        {/* Logo Section */}
        <div className="flex py-2 pl-4 ">
          <img
            src="/icons/LogoFull.png"
            alt="Logo"
            className="h-16"
          />
        </div>

        {/* Navigation Links */}
        <div>
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel
                asChild
                className="text-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <a href={item.url}>{item.title}</a>
              </SidebarGroupLabel>
            </SidebarGroup>
          ))}
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 w-full flex flex-row items-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-4 text-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <span>Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-7.5A2.25 2.25 0 003.75 5.25v13.5A2.25 2.25 0 006 21h7.5a2.25 2.25 0 002.25-2.25V15M19.5 12h-12m6-3l3 3m-3 3l3-3"
              />
            </svg>
          </button>
          <div className="mr-4">
            <ModeToggle />
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}