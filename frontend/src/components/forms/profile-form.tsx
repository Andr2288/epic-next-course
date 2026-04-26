"use client";

import { useActionState } from "react";

import { actions } from "@/data/actions";
import type { ProfileFormState } from "@/data/validation/profile";
import type { TAuthUser } from "@/types";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import { ZodErrors } from "@/components/custom/zod-errors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const styles = {
  form: "space-y-4",
  container: "grid space-y-4",
  topRow: "grid grid-cols-1 gap-4 md:grid-cols-3",
  nameRow: "grid grid-cols-1 gap-4 md:grid-cols-2",
  fieldGroup: "space-y-2",
  textarea: "h-[224px] w-full resize-none rounded-md border p-2",
  buttonContainer: "flex justify-end",
  countBox:
    "flex h-9 w-full items-center justify-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
  creditText: "text-md mx-1 font-bold",
};

interface IProfileFormProps {
  user?: TAuthUser | null;
}

const INITIAL_STATE: ProfileFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function ProfileForm({
  user,
  className,
}: IProfileFormProps & {
  readonly className?: string;
}) {
  const [formState, formAction] = useActionState(
    actions.profile.updateProfileAction,
    INITIAL_STATE
  );

  if (!user) {
    return (
      <div className={cn(styles.form, className)}>
        <p>Unable to load profile data</p>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn(styles.form, className)}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Input
            defaultValue={user.username || ""}
            disabled
            id="username"
            name="username"
            placeholder="Username"
          />
          <Input
            defaultValue={user.email || ""}
            disabled
            id="email"
            name="email"
            placeholder="Email"
          />
          <CountBox text={user.credits ?? 0} />
        </div>

        <div className={styles.nameRow}>
          <div className={styles.fieldGroup}>
            <Input
              defaultValue={
                formState?.data?.firstName ?? user.firstName ?? ""
              }
              id="firstName"
              name="firstName"
              placeholder="First Name"
            />
            <ZodErrors error={formState?.zodErrors?.firstName} />
          </div>
          <div className={styles.fieldGroup}>
            <Input
              defaultValue={formState?.data?.lastName ?? user.lastName ?? ""}
              id="lastName"
              name="lastName"
              placeholder="Last Name"
            />
            <ZodErrors error={formState?.zodErrors?.lastName} />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <Textarea
            className={styles.textarea}
            defaultValue={formState?.data?.bio ?? user.bio ?? ""}
            id="bio"
            name="bio"
            placeholder="Write your bio here..."
          />
          <ZodErrors error={formState?.zodErrors?.bio} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <SubmitButton loadingText="Saving Profile" text="Update Profile" />
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
      <StrapiErrors error={formState?.strapiErrors} />
    </form>
  );
}

function CountBox({ text }: { text: number }) {
  const color = text > 0 ? "text-primary" : "text-red-500";
  return (
    <div className={styles.countBox}>
      You have
      <span className={cn(styles.creditText, color)}>{text}</span>
      credit(s)
    </div>
  );
}
