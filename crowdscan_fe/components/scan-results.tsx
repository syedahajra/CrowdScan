"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MatchResult {
  confidence: number;
  name: string;
  cnic: string;
  age: number;
  image: string;
}

const mockResults: MatchResult[] = [
  {
    confidence: 98.6,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/9.jpeg",
  },
  {
    confidence: 96.3,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/2.jpg",
  },
  {
    confidence: 85.3,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/8.jpeg",
  },
  {
    confidence: 75.3,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/4.jpg",
  },
  {
    confidence: 55.3,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/5.jpeg",
  },
  {
    confidence: 42.3,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/6.jpg",
  },
  {
    confidence: 20.3,
    name: "Jane Doe",
    cnic: "42201-1234567-7",
    age: 26,
    image: "/7.png",
  },
];

export default function Scan({ handleBack }: { handleBack: () => void }) {
    return (
      <div className="flex flex-col p-6">
        <h1 className="text-3xl font-bold mb-6">Scan Results</h1>
        <div className="grid grid-cols-3 gap-6">
          {mockResults.map((match, index) => (
            <div key={index} className="bg-muted/50 p-4 rounded-xl flex items-center gap-4 shadow-md">
              {/* Image on the left */}
              <div className="w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={match.image}
                  alt={`Match ${index + 1}`}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
  
              {/* Text on the right */}
              <div className="flex-1">
                <p className="text-lg font-bold">Confidence Score: {match.confidence}%</p>
                <p>Name: {match.name}</p>
                <p>CNIC: {match.cnic}</p>
                <p>Age: {match.age} years</p>
  
                {/* Traffic Light Indicators */}
                <div className="flex gap-1 mt-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Centered Button with Proper Sizing */}
        <div className="my-6 ">
          <Button className="px-6 py-2" onClick={handleBack}>
            Back to Upload
          </Button>
        </div>
      </div>
    );
  }