"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Scan, Sliders } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ScanPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [threshold, setThreshold] = useState<number>(0.65); // Default to middle of optimal range
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleScan = async () => {
    if (files.length === 0) return;
    
    setIsScanning(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('threshold', threshold.toString());

      // Store images for results page
      const imageUrls = await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      localStorage.setItem('scannedImages', JSON.stringify(imageUrls));

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Scan failed');

      const data = await response.json();
      localStorage.setItem('scanResults', JSON.stringify(data.matches));
      router.push("/scan/results");
    } catch (error) {
      console.error('Scan error:', error);
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen flex flex-col">
        <header className="flex h-16 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
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
                  <BreadcrumbPage>Scan Faces</BreadcrumbPage>
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

          {/* Sensitivity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="threshold" className="flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                Matching Sensitivity
              </Label>
              <span className="text-sm font-medium">
                {threshold.toFixed(2)}
              </span>
            </div>
            <Slider
              id="threshold"
              min={0.3}
              max={0.8}
              step={0.01}
              value={[threshold]}
              onValueChange={([value]) => setThreshold(value)}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More matches (0.3)</span>
              <div className="flex flex-col items-center">
                <span className="font-medium text-primary">Optimal range</span>
                <span>0.6 - 0.7</span>
              </div>
              <span>Fewer matches (0.8)</span>
            </div>
          </div>

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
            disabled={files.length === 0 || isScanning}
            className="w-full"
          >
            {isScanning ? (
              "Scanning..."
            ) : (
              <>
                <Scan className="w-4 h-4 mr-2" />
                {files.length > 0 ? `Scan ${files.length} Images` : "Scan"}
              </>
            )}
          </Button>
        </div>
      </SidebarInset>
      <ModeToggle />
    </SidebarProvider>
  );
}