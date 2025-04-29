"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Fingerprint, User, FileDigit } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
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

interface MatchResult {
  confidence: number;
  name: string;
  cnic: string;
  age: number;
  image: string;
  isUnknown?: boolean;
  description?: string;
  algorithms: {
    algo1: boolean;  // Red
    algo2: boolean;  // Yellow
    algo3: boolean;  // Green
  };
}

const mockResults: MatchResult[] = [
  {
    confidence: 98.6,
    name: "Ahmed Khan",
    cnic: "42201-1234567-7",
    age: 32,
    image: "/9.jpeg",
    algorithms: {
      algo1: true,
      algo2: true,
      algo3: true
    }
  },
  {
    confidence: 96.3,
    name: "Ahmed Khan",
    cnic: "42201-1234567-7",
    age: 32,
    image: "/2.jpg",
    algorithms: {
      algo1: true,
      algo2: false,
      algo3: true
    }
  },
  {
    confidence: 85.3,
    name: "Unknown Person",
    cnic: "N/A",
    age: 0,
    image: "/8.jpeg",
    isUnknown: true,
    description: "Seen at Karachi Market CCTV",
    algorithms: {
      algo1: false,
      algo2: true,
      algo3: true
    }
  },
  {
    confidence: 75.1,
    name: "Unknown Person",
    cnic: "N/A",
    age: 0,
    image: "/5.jpeg",
    isUnknown: true,
    description: "Seen at Assembly Hall CCTV",
    algorithms: {
        algo1: false,  
        algo2: false,
        algo3: true
      }
  },
];

const AlgorithmIndicators = ({ algorithms }: { algorithms: MatchResult['algorithms'] }) => (
    
  <div className="flex gap-1 mt-2">
    <div 
      className={`w-3 h-3 rounded-full ${
        algorithms.algo1 ? 'bg-red-500' : 'bg-gray-200'
      }`} 
      title="Algorithm 1: FaceNet" 
    />
    <div 
      className={`w-3 h-3 rounded-full ${
        algorithms.algo2 ? 'bg-yellow-500' : 'bg-gray-200'
      }`} 
      title="Algorithm 2: ArcFace" 
    />
    <div 
      className={`w-3 h-3 rounded-full ${
        algorithms.algo3 ? 'bg-green-500' : 'bg-gray-200'
      }`} 
      title="Algorithm 3: DeepFace" 
    />
  </div>
);

export default function ScanResults({ scannedImages = [] }: { scannedImages?: string[] }) {
  const router = useRouter();

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
        {mockResults.map((match, index) => (
          <div 
            key={index} 
            className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative aspect-square">
              <Image
                src={match.image}
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
                  match.confidence > 90 ? 'bg-green-100 text-green-800' :
                  match.confidence > 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {match.confidence.toFixed(1)}%
                </span>
              </div>

              <Progress value={match.confidence} className="h-2" />
              <AlgorithmIndicators algorithms={match.algorithms} />

              <div className="space-y-2 text-sm text-muted-foreground">
                {!match.isUnknown ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4" />
                      <span>CNIC: {match.cnic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Age: {match.age} years</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2">
                    <FileDigit className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-2">{match.description}</span>
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
    </div></SidebarInset>
      <ModeToggle /> {/* Added ModeToggle */}
    </SidebarProvider>
  );
}