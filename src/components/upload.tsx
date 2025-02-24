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
  const [formData, setFormData] = useState({ name: "", cnic: "", address: "" });

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    toast.success("Files selected successfully!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cnic" && value.length > 13) return; // Restrict CNIC to 13 characters
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = async () => {
    if (files.length === 0) {
      toast.error("No files selected for search.");
      return;
    }

    if (formData.cnic.length !== 13) {
      toast.error("CNIC must be exactly 13 digits.");
      return;
    }

    setsearching(true);
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    form.append("name", formData.name);
    form.append("cnic", formData.cnic);
    form.append("address", formData.address);

    try {
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Search completed successfully!");
        console.log("Search Result:", result);
      } else {
        toast.error(result.error || "Search failed.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setsearching(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Card className="p-6 m-5 border border-gray-200">
      

      <div className="mt-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="cnic"
          placeholder="CNIC (13 digits)"
          value={formData.cnic}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
          maxLength={13}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          className="border p-2 w-full mt-2"
        />
      </div>
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
      <Button className="mt-4" onClick={handleSearch} disabled={searching}>
        {searching ? "Uploading..." : "Upload"}
      </Button>
    </Card>
  );
}
