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

export function SignupForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE
  );

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                defaultValue={formState?.data?.username ?? ""}
              />
              <ZodErrors error={formState?.zodErrors?.username} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                defaultValue={formState?.data?.email ?? ""}
              />
              <ZodErrors error={formState?.zodErrors?.email} />
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
              text="Sign Up"
            />
            <StrapiErrors error={formState?.strapiErrors} />
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="/signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
