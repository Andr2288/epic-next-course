"use server";

import { flattenError } from "zod";

import { services } from "@/data/services";
import {
  ProfileFormSchema,
  ProfileImageFormSchema,
  type ProfileFormState,
  type ProfileImageFormState,
} from "@/data/validation/profile";

export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const fields = Object.fromEntries(formData) as Record<string, string>;
  const validatedFields = ProfileFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const responseData = await services.profile.updateProfileService(
    validatedFields.data
  );

  if (!responseData.success || responseData.error) {
    return {
      success: false,
      message: "Failed to update profile.",
      strapiErrors: responseData.error ?? null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  return {
    success: true,
    message: "Profile updated successfully.",
    strapiErrors: null,
    zodErrors: null,
    data: {
      firstName: validatedFields.data.firstName,
      lastName: validatedFields.data.lastName,
      bio: validatedFields.data.bio,
    },
  };
}

export async function updateProfileImageAction(
  prevState: ProfileImageFormState,
  formData: FormData
): Promise<ProfileImageFormState> {
  const user = await services.auth.getUserMeService();
  if (!user.success || !user.data) {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
      strapiErrors: null,
      zodErrors: null,
      data: prevState.data,
    };
  }

  const currentImageId = user.data.image?.id;
  const raw = formData.get("image");
  const image =
    raw instanceof File && raw.size > 0
      ? raw
      : raw instanceof Blob && raw.size > 0
        ? new File([raw], "profile-image", {
            type: raw.type || "application/octet-stream",
          })
        : null;

  if (!image) {
    return {
      success: false,
      message: "No image provided",
      strapiErrors: null,
      zodErrors: {
        image: [
          "Choose a file before saving. Use .jpg, .jpeg, .png, or .webp (not .jpj).",
        ],
      },
      data: prevState.data,
    };
  }

  const validatedFields = ProfileImageFormSchema.safeParse({ image });

  if (!validatedFields.success) {
    const flattenedErrors = flattenError(validatedFields.error);
    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: prevState.data,
    };
  }

  if (currentImageId) {
    try {
      await services.file.fileDeleteService(currentImageId);
    } catch {
      // Continue with upload even if delete fails
    }
  }

  const fileUploadResponse = await services.file.fileUploadService(
    validatedFields.data.image
  );

  if (!fileUploadResponse.success || !fileUploadResponse.data?.length) {
    return {
      success: false,
      message: "Failed to upload image",
      strapiErrors: fileUploadResponse.error ?? null,
      zodErrors: null,
      data: prevState.data,
    };
  }

  const uploadedImageId = fileUploadResponse.data[0]?.id;
  if (uploadedImageId == null) {
    return {
      success: false,
      message: "Failed to upload image",
      strapiErrors: {
        status: 500,
        name: "UploadError",
        message: "Missing file id from upload response",
      },
      zodErrors: null,
      data: prevState.data,
    };
  }

  const updateImageResponse =
    await services.profile.updateProfileImageService(uploadedImageId);

  if (!updateImageResponse.success || updateImageResponse.error) {
    return {
      success: false,
      message: "Failed to update profile with new image",
      strapiErrors: updateImageResponse.error ?? null,
      zodErrors: null,
      data: prevState.data,
    };
  }

  return {
    success: true,
    message: "Profile image updated successfully",
    strapiErrors: null,
    zodErrors: null,
    data: {
      image: validatedFields.data.image,
    },
  };
}
