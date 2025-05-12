"use client";

import * as React from "react";
import {
  CloudUpload,
  LayoutDashboard,
  ScanSearch,
  Users,
  CircleHelp
} from "lucide-react";
import Image from "next/image"; // Add this import
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-swticher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Syeda Hajra",
    email: "admin@eaxee.com",
    avatar: "",
  },
  teams: [
    {
      name: "CrowdScan",
      logo: "/logo-removebg.png", // Changed from icon to image path
      plan: "Face Recognition System",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Upload to Database",
      url: "/UploadImages",
      icon: CloudUpload,
      isActive: true,
    },
    {
      title: "Match Faces",
      url: "scan",
      icon: ScanSearch,
    },
  ],
  projects: [
    {
      name: "Manage Users",
      url: "manageUsers",
      icon: Users,
    },
    {
      name: "How it works",
      url: "Manual",
      icon: CircleHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher 
          teams={data.teams.map(team => ({
            ...team,
            // Custom renderer for the logo
            renderLogo: () => (
              <div className="relative h-8 w-8">
                <Image
                  src={team.logo}
                  alt={`${team.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )
          }))} 
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}