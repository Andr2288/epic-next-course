import { z } from "zod";

export const ProfileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export type ProfileFormState = {
  success?: boolean;
  message?: string;
  data?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    firstName?: string[];
    lastName?: string[];
    bio?: string[];
  } | null;
};

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/pjpeg",
]);

function fileLooksLikeAllowedImage(file: File): boolean {
  const t = file.type.trim().toLowerCase();
  if (IMAGE_MIME.has(t)) return true;
  // Windows / odd exports sometimes send octet-stream; fall back to extension.
  if (t === "" || t === "application/octet-stream") {
    return /\.(jpe?g|png|webp)$/i.test(file.name);
  }
  return false;
}

export const ProfileImageFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Image is required")
    .refine((file) => file.size <= 5_000_000, "Image must be less than 5MB")
    .refine(
      (file) => fileLooksLikeAllowedImage(file),
      "Image must be JPEG, PNG, or WebP (.jpg, .jpeg, .png, .webp)"
    ),
});

export type ProfileImageFormValues = z.infer<typeof ProfileImageFormSchema>;

export type ProfileImageFormState = {
  success?: boolean;
  message?: string;
  data?: {
    image?: File;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    image?: string[];
  } | null;
};
