"use client";
import { useState, useCallback } from "react";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { ImagePlus, User, Users, X, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
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

export default function UploadPage() {
  const [knownFiles, setKnownFiles] = useState<File[]>([]);
  const [unknownFiles, setUnknownFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<"known" | "unknown">("known");

  const handleKnownDrop = useCallback((acceptedFiles: File[]) => {
    setKnownFiles((prev) => [...prev, ...acceptedFiles]); // Append new files
  }, []);

  const handleUnknownDrop = useCallback((acceptedFiles: File[]) => {
    setUnknownFiles((prev) => [...prev, ...acceptedFiles]); // Append new files
  }, []);

  const removeKnownFile = (index: number) => {
    setKnownFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUnknownFile = (index: number) => {
    setUnknownFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add these state variables
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateCNIC = (cnic: string) => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    return cnicRegex.test(cnic);
  };

  const handleSubmit = async () => {
    // Validate before submission
    if (activeTab === "known") {
      if (!name && !cnic) {
        toast.error("At least one of Name or CNIC is required");
        return;
      }

      if (cnic && !validateCNIC(cnic)) {
        toast.error("CNIC must be in format 42101-1234567-8");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      const filesToUpload = activeTab === "known" ? knownFiles : unknownFiles;

      // Helper to convert a File to base64
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1]; // remove "data:image/...;base64,"
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Convert all files to base64 strings
      const base64Images = await Promise.all(filesToUpload.map(fileToBase64));

      // Create payload as JSON
      const payload: any = {
        images: base64Images,
      };

      if (activeTab === "known") {
        payload.name = name || "Unknown";
        payload.cnic = cnic ? cnic.replace(/-/g, "") : "NA";
        payload.address = address || "NA";
      } else {
        payload.name = "Unknown";
        payload.cnic = "NA";
        payload.address = description || "NA";
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
      toast.success("Upload successful!");
      // Reset form
      if (activeTab === "known") {
        setKnownFiles([]);
        setName("");
        setCnic("");
        setAddress("");
      } else {
        setUnknownFiles([]);
        setDescription("");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center border-b gap-2">
          <div className="flex items-center gap-2  px-4">
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
                  <BreadcrumbPage>Upload Images</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto">
              <ModeToggle />
            </div>
        </header>
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-transparent">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text inline-block w-[400px]">
              Register Faces
            </span>
          </h1>

          <p className="text-muted-foreground text-sm">
            Upload images of individuals to identify and track efficiently.
          </p>

          {/* Tabs */}
          <div className="flex gap-4 border-b pb-2">
            <Button
              className={
                activeTab === "known"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                  : ""
              }
              variant={activeTab === "known" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("known")}
            >
              <User className="w-4 h-4 mr-2" />
              Known Person
            </Button>
            <Button
              className={
                activeTab === "unknown"
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                  : ""
              }
              variant={activeTab === "unknown" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("unknown")}
            >
              <Users className="w-4 h-4 mr-2" />
              Unknown People
            </Button>
          </div>

          <div className="border rounded-xl p-6 shadow-sm bg-white dark:bg-muted space-y-6">
            {/* Known Person Form */}
            {activeTab === "known" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Full Name{" "}
                      <span className="text-muted-foreground">
                        (optional if CNIC provided)
                      </span>
                    </label>
                    <input
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Muhammad Ali"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      CNIC Number{" "}
                      <span className="text-muted-foreground">
                        (optional if name provided)
                      </span>
                    </label>
                    <input
                      className="w-full p-2 border rounded"
                      placeholder="42201-9917151-6"
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value)}
                    />
                    {cnic && !validateCNIC(cnic) && (
                      <p className="text-xs text-red-500">
                        CNIC must be in format 42101-1234567-8
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Address</label>
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="House #, Street, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <FileUpload
                  onDrop={handleKnownDrop}
                  label="Drag & drop images of known person"
                  selectedCount={knownFiles.length}
                  multiple
                />
                {/* Preview Grid */}
                {knownFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {knownFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeKnownFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:brightness-110"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <ImagePlus className="w-4 h-4 mr-2" />
                  )}
                  Register Identity
                </Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
            )}

            {/* Unknown People Form */}
            {activeTab === "unknown" && (
              <div className="space-y-6">
                <FileUpload
                  onDrop={handleUnknownDrop}
                  label="Drag & drop images of unknown people"
                  selectedCount={unknownFiles.length}
                  multiple
                />

                {/* Preview Grid */}
                {unknownFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {unknownFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeUnknownFile(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Optional Description
                  </label>
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="E.g. 'CCTV footage from market'"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:brightness-110"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <ImagePlus className="w-4 h-4 mr-2" />
                  )}
                  Store in Gallery
                </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
