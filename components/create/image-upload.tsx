"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);

  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-48 h-48 mx-auto">
          <Image
            src={preview}
            alt="Token preview"
            fill
            className="rounded-none object-cover border-4 border-muted"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 rounded-none"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted rounded-none flex items-center justify-center">
          <Upload className="w-12 h-12 text-muted-foreground" />
        </div>
      )}
      <div className="flex justify-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="max-w-xs"
          required={!preview}
        />
      </div>
    </div>
  );
}
