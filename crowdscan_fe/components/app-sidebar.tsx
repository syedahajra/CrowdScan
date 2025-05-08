"use client";

import * as React from "react";
import {
  CloudUpload,
  GalleryVerticalEnd,
  LayoutDashboard,
  ScanSearch,
  Users,
  CircleHelp
} from "lucide-react";

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
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CrowdScan",
      logo: GalleryVerticalEnd,
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
        <TeamSwitcher teams={data.teams} />
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
