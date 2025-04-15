"use client";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
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
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggler";
import { ImagePlus } from "lucide-react";
import ScanResults from "@/components/scan-results";
import SensitivitySlider  from "@/components/sensitivity";

interface UploadedFile {
  name: string;
  path: string;
}

export default function Page() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [viewResults, setViewResults] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch("/api/upload/route.ts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadedFiles(result.uploads);
        console.log("Upload successful:", result);
      } else {
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleScan = () => {
    setViewResults(true);
  };
  const handleBack = () => {
    setViewResults(false);
  };
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {!viewResults ? (
          <div className="grid grid-cols-4 gap-4 h-screen p-4">
            <div className="col-span-3 grid grid-rows-3 gap-4">
              <div className="row-span-1 flex flex-col rounded-xl bg-muted/50 p-6">
                <h1 className="text-3xl font-bold">Upload & Scan Images</h1>
                <p className="text-sm mt-1 text-muted-foreground">
                  Easily upload images and start scanning with just a click
                </p>

                <div className="mt-4 flex flex-row gap-6 items-center">
                  <div
                    className="aspect-square w-64 rounded-xl bg-accent p-6 flex flex-col justify-center cursor-pointer"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                    <ImagePlus className="w-14 h-14" />
                    <h2 className="text-3xl font-bold mt-4">
                      {selectedFiles.length}
                    </h2>
                    <p className="text-gray-400">
                      {selectedFiles.length > 0
                        ? "Images Selected"
                        : "Click to select images"}
                    </p>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-4 grid-rows-2 gap-2">
                      {previewUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt="Preview"
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-64 mt-4 flex gap-4">
                  <Button className="flex-1" onClick={handleUpload}>
                    Upload
                  </Button>
                  <Button className="flex-1" onClick={handleScan} type="submit">
                    Scan
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <SensitivitySlider value={sensitivity} onChange={setSensitivity}/>
              <div className="rounded-xl bg-muted/50 p-4">
                <h1 className="text-1xl font-bold">Recent Match</h1>
                <p>Confidence Score 85%</p>
              </div>
            </div>
          </div>
        ) : (
          <ScanResults handleBack={handleBack} />
        )}
      </SidebarInset>
      <ModeToggle />
    </SidebarProvider>
  );
}
