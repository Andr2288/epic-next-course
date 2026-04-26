import { cookies } from "next/headers";

import { api } from "@/data/data-api";
import { getStrapiURL } from "@/lib/utils";
import type { TAuthUser, TStrapiResponse } from "@/types";

import { getUserMeService } from "./auth";

type TUpdateProfile = {
  firstName: string;
  lastName: string;
  bio: string;
};

const baseUrl = getStrapiURL();

async function getJwt(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get("jwt")?.value;
}

export async function updateProfileService(
  profileData: TUpdateProfile
): Promise<TStrapiResponse<TAuthUser>> {
  const me = await getUserMeService();
  if (!me.success || !me.data?.id) {
    return {
      success: false,
      status: 401,
      error: {
        status: 401,
        name: "Unauthorized",
        message: "User id is required",
      },
    };
  }

  const authToken = await getJwt();
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

  const url = new URL(`/api/users/${me.data.id}`, baseUrl);
  return api.put<TAuthUser, TUpdateProfile>(url.href, profileData, {
    authToken,
  });
}

export async function updateProfileImageService(
  imageId: number
): Promise<TStrapiResponse<TAuthUser>> {
  const me = await getUserMeService();
  if (!me.success || !me.data?.id) {
    return {
      success: false,
      status: 401,
      error: {
        status: 401,
        name: "Unauthorized",
        message: "User id is required",
      },
    };
  }

  const authToken = await getJwt();
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

  const url = new URL(`/api/users/${me.data.id}`, baseUrl);
  return api.put<TAuthUser, { image: number }>(
    url.href,
    { image: imageId },
    { authToken }
  );
}
