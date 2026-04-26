"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { flattenError } from "zod";

import { isAuthError, isAuthSuccess } from "@/data/services/auth";
import { services } from "@/data/services";
import {
  SigninFormSchema,
  SignupFormSchema,
  type FormState,
} from "@/data/validation/auth";

const cookieOptions = {
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = SignupFormSchema.safeParse(fields);

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

  const responseData = await services.auth.registerUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Register.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  if (!isAuthSuccess(responseData)) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, cookieOptions);
  redirect("/dashboard");
}

export async function loginUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = {
    identifier: formData.get("identifier") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = SigninFormSchema.safeParse(fields);

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

  const responseData = await services.auth.loginUserService(
    validatedFields.data
  );

  if (!responseData) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  if (isAuthError(responseData)) {
    return {
      success: false,
      message: "Failed to Login.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  if (!isAuthSuccess(responseData)) {
    return {
      success: false,
      message: "Ops! Something went wrong. Please try again.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, cookieOptions);
  redirect("/dashboard");
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.set("jwt", "", { ...cookieOptions, maxAge: 0 });
  redirect("/");
}

export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  return cookieStore.get("jwt")?.value;
}
