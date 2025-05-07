"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import scanAnimation from "@/public/animations/dashboard.json";
import {
  Scan,
  Shield,
  Database,
  Fingerprint,
  Crosshair,
  Lock,
  Gauge,
  Users,
  SlidersHorizontal,
  AlertCircle,
  Camera
} from "lucide-react";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Welcome to CrowdScan
                </h1>
                <p className=" text-muted-foreground">
                  Facial Recognition System for Law Enforcement
                </p>
                <p className="text-base">
                  CrowdScan helps officers quickly find and match faces—whether
                  in a crowd or from a photo. It's easy to use, fast, and built
                  to support real police work.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full w-fit">
                    <Scan className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Quick Face Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly compares a face to stored profiles to help
                    identify people.
                  </p>
                </div>

                <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
                  <div className="bg-blue-500/10 p-3 rounded-full w-fit">
                    <Database className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Face Storage System</h3>
                  <p className="text-sm text-muted-foreground">
                    Save images of suspects or crowds for future matching.
                  </p>
                </div>

                <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
                  <div className="bg-purple-500/10 p-3 rounded-full w-fit">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Safe and Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is protected to make sure only trusted users have
                    access.
                  </p>
                </div>

                <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
                  <div className="bg-green-500/10 p-3 rounded-full w-fit">
                    <SlidersHorizontal className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-lg">Flexible Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust how strict the system is when checking for a face
                    match.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2">
              <div className="relative h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-xl"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-lg"></div>
                
                {/* Centered Lottie Animation */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <Lottie 
                    animationData={scanAnimation} 
                    loop={true}
                    autoplay={true}
                    className="w-full h-auto max-h-[500px]" // Responsive sizing
                  />
                </div>
                </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
