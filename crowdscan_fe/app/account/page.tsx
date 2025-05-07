"use client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
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
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Lock, Mail, User, Shield, Check, X , Badge} from "lucide-react";

export default function AccountPage() {
  // Placeholder user data
  const user = {
    name: "Admin User",
    email: "admin@crowdscan.com",
    role: "Administrator",
    lastLogin: "2023-11-15 14:30",
    avatar: "/avatars/admin.png" // Leave empty for fallback
  };

  const handlePasswordChange = (e: React.FormEvent) => {
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

    // Simulate API call
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "Updating password...",
        success: () => {
          form.reset();
          return "Password updated successfully";
        },
        error: "Failed to update password",
      }
    );
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
                <BreadcrumbItem>
                  <BreadcrumbPage>My Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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
                    <AvatarFallback className="bg-primary text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge  className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Last login: {user.lastLogin}
                      </p>
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
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                    <Button type="submit">
                      Update Password
                    </Button>
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
                <li>Include numbers, symbols, and both uppercase/lowercase letters</li>
                <li>Consider using a password manager</li>
              </ul>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}