"use client";

import * as React from "react";
import {
  CloudUpload,
  LayoutDashboard,
  ScanSearch,
  Users,
  CircleHelp,
} from "lucide-react";
import Image from "next/image";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "", // Optional
    role: "", // Add this
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check-session", {
          method: "GET",
          credentials: "include", // IMPORTANT to send cookies
        });
        const data = await res.json();
        if (res.ok) {
          setUser({
            name: data.name,
            email: data.email,
            avatar: "", // Optional: you can update this
            role: data.role, // Capture role from response
          });
        } else {
          console.error("Session check failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchUser();
  }, []);

  const teams = [
    {
      name: "CrowdScan",
      logo: "/logo-removebg.png",
      plan: "Face Recognition System",
    },
  ];

  const navMain = [
    { title: "Dashboard", url: "dashboard", icon: LayoutDashboard },
    { title: "Upload to Database", url: "/UploadImages", icon: CloudUpload },
    { title: "Match Faces", url: "scan", icon: ScanSearch },
  ];

  const projects = [
  ...(user.role === "admin"
    ? [{ name: "Manage Users", url: "manageUsers", icon: Users }]
    : []),
  { name: "How it works", url: "Manual", icon: CircleHelp },
];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={teams.map((team) => ({
            ...team,
            renderLogo: () => (
              <div className="relative h-8 w-8">
                <Image
                  src={team.logo}
                  alt={`${team.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ),
          }))}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
