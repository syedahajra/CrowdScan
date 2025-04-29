"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Scan } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/theme-toggler";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function ScanPage() {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleScan = () => {
    // In a real app, you would upload files and process them first
    router.push("/scan/results");
  };

  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="min-h-screen flex flex-col"> {/* Added flex layout */}
      <header className="flex h-16 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Facial Recognition System
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Scan Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Match Faces</h1>
      <p className="text-muted-foreground">
        Upload images to scan against the database
      </p>

      <FileUpload
        onDrop={handleDrop}
        label="Drag & drop images to scan"
        selectedCount={files.length}
        multiple
      />

      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={`Scan ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      <Button 
        onClick={handleScan} 
        disabled={files.length === 0}
        className="w-full"
      >
        <Scan className="w-4 h-4 mr-2" />
        {files.length > 0 ? `Scan ${files.length} Images` : "Scan"}
      </Button>
    </div></SidebarInset>
      <ModeToggle /> {/* Added ModeToggle */}
    </SidebarProvider>
  );
}