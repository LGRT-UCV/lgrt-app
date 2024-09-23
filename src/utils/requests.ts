import { Routes } from "@/lib/constants";
import { signOut } from "next-auth/react";

export enum RequestMethods {
  DELETE = "DELETE",
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
}

export const API_REQUEST_HEADERS = { "Content-Type": "application/json" };

export const newRequest = async (
  uri: string,
  method: RequestMethods,
  headers: HeadersInit = API_REQUEST_HEADERS,
  body?: string,
) => {
  const response = await fetch(uri, {
    method,
    body,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      await signOut({ redirect: true, callbackUrl: Routes.Login });
    } else {
      throw new Error(`Error: ${JSON.stringify(await response.json())}`);
    }
  }

  return await response.json();
};
