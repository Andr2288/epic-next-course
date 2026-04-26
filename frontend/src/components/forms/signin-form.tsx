"use client";

import { useActionState } from "react";
import Link from "next/link";

import { actions } from "@/data/actions";
import type { FormState } from "@/data/validation/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import { ZodErrors } from "@/components/custom/zod-errors";

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-2",
  footer: "flex flex-col",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function SigninForm() {
  const [formState, formAction] = useActionState(
    actions.auth.loginUserAction,
    INITIAL_STATE
  );

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign In</CardTitle>
            <CardDescription>
              Enter your details to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="identifier">Username or Email</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="username or email"
                defaultValue={formState?.data?.identifier ?? ""}
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                defaultValue={formState?.data?.password ?? ""}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <SubmitButton
              className="w-full"
              loadingText="Loading"
              text="Sign In"
            />
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Don&apos;t have an account?
          <Link className={styles.link} href="/signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
