"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Fingerprint, User, FileDigit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
import { useEffect, useState } from "react";

interface MatchResult {
  name: string;
  address: string;
  cnic_number: string;
  image: string; // base64
  similarity: number; // 0-1
  isUnknown?: boolean;
  description?: string;
}

const AlgorithmIndicators = ({ modelName }: { modelName: string }) => {
  // Convert Django model name to your indicator format
  const algo1 = modelName.includes("VGG"); // VGG-Face -> algo1 (Red)
  const algo2 = modelName.includes("Arc"); // ArcFace -> algo2 (Yellow)
  const algo3 = modelName.includes("SF"); // SFace -> algo3 (Green)

  return (
    <div className="flex gap-1 mt-2">
      <div 
        className={`w-3 h-3 rounded-full ${algo1 ? 'bg-red-500' : 'bg-gray-200'}`} 
        title="Algorithm 1: VGG-Face" 
      />
      <div 
        className={`w-3 h-3 rounded-full ${algo2 ? 'bg-yellow-500' : 'bg-gray-200'}`} 
        title="Algorithm 2: ArcFace" 
      />
      <div 
        className={`w-3 h-3 rounded-full ${algo3 ? 'bg-green-500' : 'bg-gray-200'}`} 
        title="Algorithm 3: SFace" 
      />
    </div>
  );
};

export default function ScanResults() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [scannedImages, setScannedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve results from localStorage
    const storedResults = localStorage.getItem('scanResults');
    const storedImages = localStorage.getItem('scannedImages');

    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        // Convert similarity (0-1) to confidence percentage (0-100)
        const formattedResults = parsedResults.map((result: any) => ({
          ...result,
          similarity: result.similarity * 100, // Convert to percentage
          isUnknown: result.similarity < 0.7, // Mark as unknown if similarity < 70%
          description: result.similarity < 0.7 ? "Potential match from database" : undefined
        }));
        setMatches(formattedResults);
      } catch (error) {
        console.error("Error parsing results:", error);
        router.push('/scan');
      }
    } else {
      router.push('/scan');
    }

    if (storedImages) {
      try {
        setScannedImages(JSON.parse(storedImages));
      } catch (error) {
        console.error("Error parsing scanned images:", error);
      }
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading results...</p>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
                <BreadcrumbLink href="Scan">
                    Scan Faces
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
          {/* Scanned Images Preview */}
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
            <Button 
              onClick={() => router.push('/scan')}
              variant="outline"
            >
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.similarity > 90 ? 'bg-green-100 text-green-800' :
                      match.similarity > 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {match.similarity.toFixed(1)}%
                    </span>
                  </div>

                  <Progress value={match.similarity} className="h-2" />
                  <AlgorithmIndicators modelName="VGG-Face" /> {/* You might need to pass actual model name */}

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
                        <span className="line-clamp-2">{match.description || "Potential match from database"}</span>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full mt-2" size="sm">
                    View Full Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => router.push('/scan')} 
              className="px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Scan More Images
            </Button>
          </div>
        </div>
      </SidebarInset>
      <ModeToggle />
    </SidebarProvider>
  );
}