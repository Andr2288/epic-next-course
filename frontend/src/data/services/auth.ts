import { cookies } from "next/headers";
import qs from "qs";

import { getStrapiURL } from "@/lib/utils";
import type { TAuthUser, TImage, TStrapiResponse } from "@/types";

function normalizeUserImage(image: unknown): TImage | null {
  if (image == null || typeof image !== "object") return null;
  const root = image as Record<string, unknown>;
  const inner =
    root.data != null && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;
  const id = inner.id;
  const url = inner.url;
  if (typeof id !== "number" || typeof url !== "string") return null;
  const documentId =
    typeof inner.documentId === "string" ? inner.documentId : String(id);
  const alt = inner.alternativeText;
  return {
    id,
    documentId,
    url,
    alternativeText: typeof alt === "string" ? alt : null,
  };
}

export type TRegisterUser = {
  username: string;
  password: string;
  email: string;
};

export type TLoginUser = {
  identifier: string;
  password: string;
};

export type TAuthResponse = {
  jwt: string;
  user: TAuthUser;
};

export type TAuthServiceResponse = TAuthResponse | { error: TStrapiResponse<null>["error"] };

export function isAuthError(
  response: TAuthServiceResponse
): response is { error: NonNullable<TStrapiResponse<null>["error"]> } {
  return "error" in response && !("jwt" in response);
}

export function isAuthSuccess(response: TAuthServiceResponse): response is TAuthResponse {
  return "jwt" in response;
}

const baseUrl = getStrapiURL();

export async function registerUserService(
  userData: TRegisterUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL("/api/auth/local/register", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return (await response.json()) as TAuthServiceResponse;
  } catch (error) {
    console.error("Registration Service Error:", error);
    return undefined;
  }
}

export async function loginUserService(
  userData: TLoginUser
): Promise<TAuthServiceResponse | undefined> {
  const url = new URL("/api/auth/local", baseUrl);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
    });

    return (await response.json()) as TAuthServiceResponse;
  } catch (error) {
    console.error("Login Service Error:", error);
    return undefined;
  }
}

export async function getUserMeService(): Promise<TStrapiResponse<TAuthUser>> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;

  if (!authToken) {
    return {
      success: false,
      status: 401,
      error: {
        status: 401,
        name: "Unauthorized",
        message: "Missing authentication token",
      },
    };
  }

  const url = new URL("/api/users/me", baseUrl);
  url.search = qs.stringify(
    {
      populate: {
        image: {
          fields: ["url", "alternativeText"],
        },
      },
    },
    { encodeValuesOnly: true }
  );

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-store",
    });
    const data: unknown = await response.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      (data as { error?: unknown }).error
    ) {
      const err = (data as { error: NonNullable<TStrapiResponse<null>["error"]> })
        .error;
      return {
        success: false,
        data: undefined,
        error: err,
        status: response.status,
      };
    }

    const user =
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      (data as { data: unknown }).data
        ? (data as { data: TAuthUser }).data
        : (data as TAuthUser);

    if (!response.ok) {
      return {
        success: false,
        data: undefined,
        error: {
          status: response.status,
          name: "Error",
          message: "Failed to load user",
        },
        status: response.status,
      };
    }

    const withImage: TAuthUser = {
      ...user,
      image: normalizeUserImage((user as Record<string, unknown>).image),
    };

    return {
      success: true,
      data: withImage,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        details: {},
      },
      status: 500,
    };
  }
}
