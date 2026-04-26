"use client";

import { useActionState } from "react";

import { actions } from "@/data/actions";
import type { ProfileImageFormState } from "@/data/validation/profile";
import type { TImage } from "@/types";
import ImagePicker from "@/components/custom/image-picker";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import { ZodErrors } from "@/components/custom/zod-errors";
import { cn } from "@/lib/utils";

interface IProfileImageFormProps {
  image?: TImage | null;
}

const INITIAL_STATE: ProfileImageFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function ProfileImageForm({
  image,
  className,
}: IProfileImageFormProps & {
  className?: string;
}) {
  const [formState, formAction] = useActionState(
    actions.profile.updateProfileImageAction,
    INITIAL_STATE
  );

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <ImagePicker
          defaultValue={image?.url || ""}
          id="image"
          label="Profile Image"
          name="image"
        />
        <ZodErrors error={formState?.zodErrors?.image} />
        <StrapiErrors error={formState?.strapiErrors} />
      </div>
      {formState?.message ? (
        <p
          className={
            formState.success ? "text-sm text-green-600" : "text-sm text-pink-500"
          }
        >
          {formState.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <SubmitButton loadingText="Saving Image" text="Update Image" />
      </div>
    </form>
  );
}
