import { cookies } from "next/headers";

import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse } from "@/types";

const baseUrl = getStrapiURL();

export type TFileUploadEntry = {
  id: number;
  documentId?: string;
  name?: string;
  url: string;
  alternativeText?: string | null;
};

function parseUploadPayload(data: unknown): TFileUploadEntry[] {
  if (Array.isArray(data)) return data as TFileUploadEntry[];
  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: TFileUploadEntry[] }).data;
  }
  return [];
}

export async function fileUploadService(
  file: File
): Promise<TStrapiResponse<TFileUploadEntry[]>> {
  const jar = await cookies();
  const authToken = jar.get("jwt")?.value;

  if (!authToken) {
    return {
      success: false,
      data: undefined,
      error: {
        status: 401,
        name: "AuthError",
        message: "No auth token found",
      },
      status: 401,
    };
  }

  const url = new URL("/api/upload", baseUrl);
  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      const err =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof (data as { error?: { name?: string; message?: string } }).error
          ?.message === "string"
          ? (data as { error: { name?: string; message: string } }).error
          : undefined;
      return {
        success: false,
        data: undefined,
        error: {
          status: response.status,
          name: err?.name ?? "UploadError",
          message: err?.message ?? "Failed to upload file",
        },
        status: response.status,
      };
    }

    const list = parseUploadPayload(data);
    return {
      success: true,
      data: list,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.error("File upload service error:", error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message: error instanceof Error ? error.message : "Upload failed",
      },
      status: 500,
    };
  }
}

export async function fileDeleteService(
  fileId: number
): Promise<TStrapiResponse<boolean>> {
  const jar = await cookies();
  const authToken = jar.get("jwt")?.value;

  if (!authToken) {
    return {
      success: false,
      data: undefined,
      error: {
        status: 401,
        name: "AuthError",
        message: "No auth token found",
      },
      status: 401,
    };
  }

  const url = new URL(`/api/upload/files/${fileId}`, baseUrl);

  try {
    const response = await fetch(url.href, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      let message = "Failed to delete file";
      try {
        const errBody: unknown = await response.json();
        if (
          typeof errBody === "object" &&
          errBody !== null &&
          "error" in errBody &&
          typeof (errBody as { error?: { message?: string } }).error
            ?.message === "string"
        ) {
          message = (errBody as { error: { message: string } }).error.message;
        }
      } catch {
        // ignore parse errors
      }
      return {
        success: false,
        data: undefined,
        error: {
          status: response.status,
          name: "DeleteError",
          message,
        },
        status: response.status,
      };
    }

    return {
      success: true,
      data: true,
      error: undefined,
      status: response.status,
    };
  } catch (error) {
    console.error("File delete service error:", error);
    return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message: error instanceof Error ? error.message : "Delete failed",
      },
      status: 500,
    };
  }
}
