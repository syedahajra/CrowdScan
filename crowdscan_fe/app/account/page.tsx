"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Lock, Mail, User, Shield, X, Badge } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggler";

export default function AccountPage() {
  const [user, setUser] = useState({
    name: "Loading...",
    email: "loading@domain.com",
    role: "Loading",
    avatar: "/avatars/admin.png",
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await fetch("/api/auth/check-session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser((prev) => ({
            ...prev,
            name: data.name,
            email: data.email,
            role: data.role,
          }));
        } else {
          toast.error(data.error || "Session check failed");
        }
      } catch (err) {
        toast.error("Failed to load session info");
      }
    };

    fetchUserSession();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        icon: <X className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    try {
      toast.promise(
        fetch("/api/auth/change-password/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Password update failed");
          form.reset();
        }),
        {
          loading: "Updating password...",
          success: "Password updated successfully",
          error: (err) => err.message || "Failed to update password",
        }
      );
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="dashboard">
                    Face Recogntion System
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </h2>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="font-medium text-base flex items-center gap-1">
                      {user.name}
                    </p>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>

                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      {user.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change Section */}
            <Card>
              <CardHeader className="border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Change Password
                </h2>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      minLength={8}
                      required
                    />
                  </div>
                  <CardFooter className="flex justify-end px-0 pb-0 pt-4">
                    <Button type="submit">Update Password</Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <div className="bg-secondary/50 p-4 rounded-lg border text-sm">
              <h3 className="font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                Security Tips
              </h3>
              <ul className="space-y-1 list-disc pl-5">
                <li>Use a unique password you don't use elsewhere</li>
                <li>
                  Include numbers, symbols, and both uppercase/lowercase letters
                </li>
                <li>Consider using a password manager</li>
              </ul>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
