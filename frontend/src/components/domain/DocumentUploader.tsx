"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FileText, UploadCloud, X, Camera, RefreshCw, File } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";

const MAX_BYTES = 16 * 1024 * 1024; // 16MB limit

interface DocumentUploaderProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
}

export function DocumentUploader({ imageUrls, onChange }: DocumentUploaderProps) {
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(
    async (files: FileList | File[] | null | undefined) => {
      if (!files || files.length === 0) return;
      
      const newUrls: string[] = [];
      let hasError = false;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Allow images, PDFs, and Word docs
        if (!file!.type.startsWith("image/") && 
            file!.type !== "application/pdf" && 
            file!.type !== "application/msword" && 
            file!.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          setError("Unsupported file format.");
          hasError = true;
          continue;
        }
        if (file!.size > MAX_BYTES) {
          setError("A file exceeds the 16MB limit.");
          hasError = true;
          continue;
        }
        try {
          const b64 = await fileToBase64(file!);
          newUrls.push(b64);
        } catch (e) {
          setError("Error reading file.");
          hasError = true;
        }
      }

      if (!hasError) setError(null);
      if (newUrls.length > 0) {
        onChange([...imageUrls, ...newUrls]);
      }
    },
    [imageUrls, onChange]
  );

  const capture = () => {
    const shot = webcamRef.current?.getScreenshot();
    if (shot) {
      onChange([...imageUrls, shot]);
      setError(null);
    }
  };

  const removeUrl = (index: number) => {
    onChange(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button variant={mode === "upload" ? "primary" : "ghost"} onClick={() => setMode("upload")} className="flex-1 text-xs py-1 h-8">
          <UploadCloud className="h-4 w-4 mr-1" /> Upload
        </Button>
        <Button variant={mode === "camera" ? "primary" : "ghost"} onClick={() => setMode("camera")} className="flex-1 text-xs py-1 h-8">
          <Camera className="h-4 w-4 mr-1" /> Camera
        </Button>
      </div>

      <div className="relative flex min-h-[12rem] flex-col overflow-hidden rounded-md border border-border bg-slate-950">
        
        {mode === "upload" ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center transition-colors cursor-pointer",
              isDragging ? "bg-accent/10" : "hover:bg-slate-900"
            )}
          >
            <UploadCloud className="h-7 w-7 text-slate-500" aria-hidden="true" />
            <p className="text-sm text-slate-300">Drag documents here, or click to browse</p>
            <p className="text-xs text-slate-500">JPG, PNG, PDF, DOC, DOCX up to 16MB</p>
            <input ref={inputRef} type="file" multiple accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={(e) => handleFiles(e.target.files)} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative h-48">
            {cameraError ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 text-center">
                <Camera className="h-7 w-7 text-slate-500" aria-hidden="true" />
                <p className="text-xs text-slate-500">Camera unavailable — check browser permissions</p>
              </div>
            ) : (
              <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" onUserMediaError={() => setCameraError(true)} className="h-full w-full object-contain bg-black absolute inset-0" />
            )}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <Button variant="primary" onClick={capture} disabled={cameraError} className="shadow-lg">
                <Camera className="h-4 w-4 mr-2" /> Capture Document
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      
      {imageUrls.length > 0 && (
        <div className="mt-3">
          <p className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            {imageUrls.length} document(s) attached
          </p>
          <div className="flex flex-wrap gap-2">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative h-16 w-16 rounded border border-border overflow-hidden bg-slate-900">
                {url.startsWith("data:image/") ? (
                  <img src={url} alt="doc preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <File className="h-6 w-6 text-slate-500" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeUrl(i)}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/70 p-0.5 text-white hover:bg-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
