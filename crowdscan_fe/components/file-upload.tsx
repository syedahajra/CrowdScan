"use client"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ImagePlus } from "lucide-react"

interface FileUploadProps {
  onDrop: (files: File[]) => void
  label: string
  selectedCount?: number
  multiple?: boolean
}

export function FileUpload({
  onDrop,
  label,
  selectedCount = 0,
  multiple = false
}: FileUploadProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2">
        <ImagePlus className="w-8 h-8 text-muted-foreground" />
        <p className="font-medium">
          {selectedCount > 0 
            ? `${selectedCount} ${multiple ? 'images' : 'image'} selected`
            : label
          }
        </p>
        <p className="text-sm text-muted-foreground">
          {multiple ? "Drag & drop or click to browse" : "Single image only"}
        </p>
      </div>
    </div>
  )
}