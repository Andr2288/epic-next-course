"use client";

import React, { useRef, useState } from "react";

import { StrapiImage } from "@/components/custom/strapi-image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImagePickerProps {
  id: string;
  name: string;
  label: string;
  showCard?: boolean;
  defaultValue?: string;
}

function generateDataUrl(file: File, callback: (imageUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(file);
}

function ImagePreview({ dataUrl }: { readonly dataUrl: string }) {
  const isRemoteLcp = dataUrl.startsWith("http://") || dataUrl.startsWith("https://");
  return (
    <StrapiImage
      alt="preview"
      className="h-full w-full rounded-lg object-cover"
      height={200}
      loading={isRemoteLcp ? "eager" : "lazy"}
      priority={isRemoteLcp}
      src={dataUrl}
      width={200}
    />
  );
}

function ImageCard({
  dataUrl,
  fileInput,
}: {
  readonly dataUrl: string;
  readonly fileInput: React.RefObject<HTMLInputElement | null>;
}) {
  const imagePreview = dataUrl ? (
    <ImagePreview dataUrl={dataUrl} />
  ) : (
    <p>No image selected</p>
  );

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-4 rounded-md border p-4">
        {imagePreview}
      </div>
      <button
        className="absolute inset-0 w-full"
        onClick={() => fileInput.current?.click()}
        type="button"
        aria-label="Choose image"
      />
    </div>
  );
}

export default function ImagePicker({
  id,
  name,
  label,
  defaultValue,
}: Readonly<ImagePickerProps>) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(defaultValue ?? null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) generateDataUrl(file, setDataUrl);
  };

  return (
    <>
      {/* Avoid display:none on file inputs: some browsers omit empty-looking file fields from FormData. */}
      <div className="sr-only">
        <Label htmlFor={id}>{label}</Label>
        <Input
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          id={id}
          name={name}
          onChange={handleFileChange}
          ref={fileInput}
          type="file"
        />
      </div>
      <ImageCard dataUrl={dataUrl ?? ""} fileInput={fileInput} />
    </>
  );
}
