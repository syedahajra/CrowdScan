"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  Scan,
  Sliders,
  ArrowLeft,
  Fingerprint,
  User,
  FileDigit,
  X,
} from "lucide-react";
import { FileUpload } from "@/components/file-upload";
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
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

interface MatchResult {
  name: string;
  address: string;
  cnic_number: string;
  image: string; // base64
  similarity: number; // 0-1
  isUnknown?: boolean;
  description?: string;
  matched_models: string[]; // Add this to track which models matched
  model_used?: string; // The primary model used
  occlusion_percentage?: number;
  query_image?: string; // Add this to store the original query image
  model_scores?: {
    // For storing individual model scores
    "VGG-Face"?: number;
    ArcFace?: number;
    SFace?: number;
  };
}

const AlgorithmIndicators = ({
  matchedModels,
}: {
  matchedModels: string[];
}) => {
  const algo1 = matchedModels.includes("VGG-Face");
  const algo2 = matchedModels.includes("ArcFace");
  const algo3 = matchedModels.includes("SFace");

  return (
    <div className="flex gap-1 mt-2">
      <div
        className={`w-3 h-3 rounded-full ${
          algo1 ? "bg-red-500" : "bg-gray-200"
        }`}
        title="VGG-Face"
      />
      <div
        className={`w-3 h-3 rounded-full ${
          algo2 ? "bg-yellow-500" : "bg-gray-200"
        }`}
        title="ArcFace"
      />
      <div
        className={`w-3 h-3 rounded-full ${
          algo3 ? "bg-green-500" : "bg-gray-200"
        }`}
        title="SFace"
      />
    </div>
  );
};

export default function ScanPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [threshold, setThreshold] = useState<number>(0.65);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [scannedImages, setScannedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingDetails, setViewingDetails] = useState<MatchResult | null>(
    null
  );

  const DetailsDialog = () => {
    if (!viewingDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">
                {viewingDetails.isUnknown
                  ? "Unknown Person"
                  : viewingDetails.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewingDetails(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Side-by-Side Image Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Query Image */}
              <div className="space-y-2">
                <h3 className="font-medium">Query Image</h3>
                <div className="relative aspect-square border rounded-lg overflow-hidden">
                  {viewingDetails.query_image ? (
                    <img
                      src={`data:image/jpeg;base64,${viewingDetails.query_image}`}
                      // {`data:image/jpeg;base64,${viewingDetails.image}`}
                      alt="Query image"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">
                        No query image available
                      </span>
                    </div>
                  )}
                </div>
                {viewingDetails.occlusion_percentage !== undefined && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Occlusion: </span>
                    <span className="font-medium">
                      {viewingDetails.occlusion_percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              {/* Matched Image */}
              <div className="space-y-2">
                <h3 className="font-medium">Matched Image</h3>
                <div className="relative aspect-square border rounded-lg overflow-hidden">
                  <Image
                    src={`data:image/jpeg;base64,${viewingDetails.image}`}
                    alt="Matched image"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Similarity: </span>
                  <span className="font-medium">
                    {viewingDetails.similarity.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Model-Specific Scores */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Algorithm Scores</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* VGG-Face Score */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-medium">VGG-Face</span>
                  </div>
                  {viewingDetails.model_scores?.["VGG-Face"] ? (
                    <div className="mt-2">
                      <Progress
                        value={viewingDetails.model_scores["VGG-Face"] * 100}
                        className="h-2"
                      />
                      <div className="text-right text-sm mt-1">
                        {(
                          viewingDetails.model_scores["VGG-Face"] * 100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                      No score available
                    </div>
                  )}
                </div>

                {/* ArcFace Score */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium">ArcFace</span>
                  </div>
                  {viewingDetails.model_scores?.["ArcFace"] ? (
                    <div className="mt-2">
                      <Progress
                        value={viewingDetails.model_scores["ArcFace"] * 100}
                        className="h-2"
                      />
                      <div className="text-right text-sm mt-1">
                        {(viewingDetails.model_scores["ArcFace"] * 100).toFixed(
                          1
                        )}
                        %
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                      No score available
                    </div>
                  )}
                </div>

                {/* SFace Score */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium">SFace</span>
                  </div>
                  {viewingDetails.model_scores?.["SFace"] ? (
                    <div className="mt-2">
                      <Progress
                        value={viewingDetails.model_scores["SFace"] * 100}
                        className="h-2"
                      />
                      <div className="text-right text-sm mt-1">
                        {(viewingDetails.model_scores["SFace"] * 100).toFixed(
                          1
                        )}
                        %
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-2">
                      No score available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Match Confidence</h3>
                <div className="flex items-center gap-4 mt-2">
                  <Progress
                    value={viewingDetails.similarity}
                    className="h-2 flex-1"
                  />
                  <span className="font-medium">
                    {viewingDetails.similarity.toFixed(1)}%
                  </span>
                </div>
                <AlgorithmIndicators
                  matchedModels={viewingDetails.matched_models}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {viewingDetails.matched_models.length === 3
                    ? "High confidence (all algorithms matched)"
                    : viewingDetails.matched_models.length === 2
                    ? "Medium confidence (2 algorithms matched)"
                    : "Single algorithm match"}
                </p>
              </div>

              <Separator />

              {!viewingDetails.isUnknown ? (
                <>
                  <div>
                    <h3 className="font-medium text-lg">Personal Details</h3>
                    <div className="mt-2 space-y-3">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">CNIC</p>
                          <p>{viewingDetails.cnic_number || "Not available"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Address
                          </p>
                          <p>{viewingDetails.address || "Not available"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <FileDigit className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium text-lg">Note</h3>
                    <p className="text-muted-foreground">
                      {viewingDetails.description ||
                        "This is a potential match that requires verification"}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-lg">Matching Algorithms</h3>
                <div className="mt-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm">
                      {viewingDetails.matched_models.includes("VGG-Face")
                        ? "VGG-Face"
                        : "Not matched"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">
                      {viewingDetails.matched_models.includes("ArcFace")
                        ? "ArcFace"
                        : "Not matched"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">
                      {viewingDetails.matched_models.includes("SFace")
                        ? "SFace"
                        : "Not matched"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={() => setViewingDetails(null)}>Close</Button>
          </div>
        </div>
      </div>
    );
  };
  const handleDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const handleScan = async () => {
    if (files.length === 0) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("threshold", threshold.toString());

      // Store images for results display
      const imageUrls = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
        })
      );
      setScannedImages(imageUrls);

      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Scan failed");
      const { matches } = await response.json();
      const matchesWithQueryImages = matches.map(
        (match: any, index: number) => ({
          ...match,
          query_image: scannedImages[index], // Add the query image
        })
      );

      setMatches(matchesWithQueryImages);
      setShowResults(true);
      toast.success("Matches Retrieved!");
    } catch (error) {
      console.error("Scan error:", error);
      toast.error("Scan failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setFiles([]);
    setShowResults(false);
    setMatches([]);
    setScannedImages([]);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen flex flex-col">
        <header className="flex h-16 items-center border-b gap-2">
          <div className="flex items-center gap-2  px-4">
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
                  <BreadcrumbPage>
                    {showResults ? "Scan Results" : "Scan Faces"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {showResults ? (
            <>
              {/* Results View */}
              {scannedImages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Scanned Images</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {scannedImages.map((img, i) => (
                      <div key={i} className="relative aspect-square">
                        <Image
                          src={img}
                          alt={`Scanned ${i + 1}`}
                          fill
                          className="object-cover rounded border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Match Results</h1>
                <Button onClick={handleNewScan} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  New Scan
                </Button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={`data:image/jpeg;base64,${match.image}`}
                        alt={`Match ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {match.isUnknown ? "Unknown Person" : match.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.similarity > 90
                              ? "bg-green-100 text-green-800"
                              : match.similarity > 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {match.similarity.toFixed(1)}%
                        </span>
                      </div>

                      <Progress value={match.similarity} className="h-2" />
                      <AlgorithmIndicators
                        matchedModels={match.matched_models}
                      />

                      <div className="space-y-2 text-sm text-muted-foreground">
                        {!match.isUnknown ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Fingerprint className="w-4 h-4" />
                              <span>CNIC: {match.cnic_number || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Address: {match.address || "N/A"}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-start gap-2">
                            <FileDigit className="w-4 h-4 mt-0.5" />
                            <span className="line-clamp-2">
                              {match.description ||
                                "Potential match from database"}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        size="sm"
                        onClick={() => setViewingDetails(match)}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Scan View */}
              <h1 className="text-3xl font-bold text-transparent">
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text inline-block w-[300px]">
                  Match Faces
                </span>
              </h1>
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
                  <Label
                    htmlFor="threshold"
                    className="flex items-center gap-2"
                  >
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
                    <span className="font-medium text-primary">
                      Optimal range
                    </span>
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
                className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:brightness-110"
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
            </>
          )}
        </div>
      </SidebarInset>
      <DetailsDialog />
    </SidebarProvider>
  );
}
