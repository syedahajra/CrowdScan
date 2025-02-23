"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function UploadComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searching, setsearching] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    toast.success("Files selected successfully!");
  };

  const handleSearch = async () => {
    if (files.length === 0) {
      toast.error("No files selected for search.");
      return;
    }
  
    setsearching(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // Append files
  
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast.success("Files converted to base64!");
  
        // Send to Django backend
        const searchResponse = await fetch("http://localhost:8000/users/find/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ images: result.files }),
        });
  
        const searchResult = await searchResponse.json();
  
        if (searchResponse.ok) {
          toast.success("Search completed successfully!");
          console.log("Search Result:", searchResult);
        } else {
          toast.error(searchResult.error || "Search failed.");
        }
      } else {
        toast.error(result.error || "Conversion to base64 failed.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setsearching(false);
    }
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("No files selected for upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // Append multiple files

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Files uploaded successfully!");
        setFiles([]); // Clear the selected files after successful upload
      } else {
        toast.error(result.error || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Card className="p-6 m-5 border border-gray-200">
      <div {...getRootProps()} className="border-dashed border-2 p-6 cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop images here, or click to select</p>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Images:</h3>
          {files.map((file, index) => (
            <p key={index}>{file.name}</p>
          ))}
          
        </div>
      )}
      <Button className="mt-4" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          <Button className="mt-4 ml-2" onClick={handleSearch} disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </Button>
    </Card>
  );
}
