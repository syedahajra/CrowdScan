"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Scan, Users, SlidersHorizontal, ClipboardList } from "lucide-react";
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
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function ManualPage() {
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="dashboard">
                    Facial Recognition System
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>How It Works</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Welcome Section */}
          <section className="space-y-2">
            <h1 className="text-3xl font-bold">How CrowdScan Works</h1>
            <p className="text-muted-foreground">
              Simple steps to use our face matching system
            </p>
            <p className="max-w-2xl">
              Our system helps police quickly find faces in crowds or match photos. 
              Just follow these easy steps.
            </p>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/UploadImages")}
            >
              <Upload className="h-6 w-6 text-blue-500" />
              <span>Upload Images</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/scan")}
            >
              <Scan className="h-6 w-6 text-green-500" />
              <span>Match Faces</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => navigateTo("/manageUsers")}
            >
              <Users className="h-6 w-6 text-purple-500" />
              <span>Manage Users</span>
            </Button>
          </section>

          {/* How It Works */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Simple 4-Step Process</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="font-medium">
                  <div className="bg-blue-100 p-2 rounded-full w-fit">
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  Step 1: Upload Images
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Add photos of suspects or crowd scenes to your database.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-medium">
                  <div className="bg-green-100 p-2 rounded-full w-fit">
                    <Scan className="h-5 w-5 text-green-500" />
                  </div>
                  Step 2: Match Faces
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  The system compares faces and finds possible matches.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-medium">
                  <div className="bg-purple-100 p-2 rounded-full w-fit">
                    <ClipboardList className="h-5 w-5 text-purple-500" />
                  </div>
                  Step 3: Review Results
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  See match scores and compare photos side by side.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="font-medium">
                  <div className="bg-orange-100 p-2 rounded-full w-fit">
                    <SlidersHorizontal className="h-5 w-5 text-orange-500" />
                  </div>
                  Step 4: Adjust Settings
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Change how strict the matching should be.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Threshold Tips */}
          <section className="bg-secondary/50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              When to Use Different Matching Settings
            </h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  {/* <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span> */}
                  <span>For Hidden Faces</span>
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use setting: <strong>0.6</strong></li>
                  <li>• When faces are partly covered</li>
                  <li>• Best for masks or shadows</li>
                </ul>
              </div>

              <div className="border-l-4 border-black pl-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  {/* <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span> */}
                  <span>For Age Differences</span>
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use setting: <strong>0.7</strong></li>
                  <li>• When matching old and new photos</li>
                  <li>• Good for finding grown-up suspects</li>
                </ul>
              </div>

              <div className="border-l-4 border-black pl-4">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  {/* <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">3</span> */}
                  <span>For Crowded Places</span>
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use setting: <strong>0.6</strong></li>
                  <li>• When scanning many people at once</li>
                  <li>• Works well in markets or events</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="font-medium mb-2">Remember:</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>Lower numbers (0.5)</strong> = More matches, but maybe wrong ones</li>
                <li>• <strong>Higher numbers (0.8)</strong> = Fewer matches, but more accurate</li>
                <li>• <strong>Start with 0.6-0.7</strong> for best results</li>
              </ul>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}