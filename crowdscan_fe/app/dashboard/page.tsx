"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Scan, Users, SlidersHorizontal,ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function DashboardPage() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Welcome Section */}
          <section className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Crowd Scan</h1>
            <p className="text-muted-foreground">
              Facial Recognition System for Law Enforcement
            </p>
            <p className="max-w-2xl">
              Crowd Scan helps you match suspects against databases using advanced
              AI models. Upload images, run matches, and manage identities in one
              secure platform.
            </p>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/UploadImages")}
            >
              <Upload className="h-6 w-6" />
              <span>Upload Images</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/scan")}
            >
              <Scan className="h-6 w-6" />
              <span>Match Faces</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/manageUsers")}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            {/* <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/settings")}
            >
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Button> */}
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">How Crowd Scan Works</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="font-medium">
                  <Upload className="h-5 w-5 mb-2" />
                  Step 1: Upload Images
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Add known (suspects) or unknown (crowd) images to the database
                  through the Upload section.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-medium">
                  <Scan className="h-5 w-5 mb-2" />
                  Step 2: Match Faces
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Run facial recognition scans to find matches between unknown
                  and known images.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-medium">
                  <ClipboardList className="h-5 w-5 mb-2" />
                  Step 3: Review Results
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  View match confidence scores and potential identifications with
                  visual comparisons.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-medium">
                  <SlidersHorizontal className="h-5 w-5 mb-2" />
                  Step 4: Adjust Settings
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Fine-tune matching thresholds and algorithm parameters for
                  optimal results.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Threshold Tips */}
          <section className="bg-secondary/50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">
              Matching Threshold Guidance
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-1">Lower Threshold (~0.5)</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5">
                  <li>More potential matches</li>
                  <li>Higher false positive rate</li>
                  <li>Good for initial broad searches</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-1">Higher Threshold (~0.8)</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-5">
                  <li>Fewer but more accurate matches</li>
                  <li>Lower false positive rate</li>
                  <li>Good for conclusive verification</li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}