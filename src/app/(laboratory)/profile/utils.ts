import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import type { TResetPasswordFormData } from "./interfaces";

export const RESET_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/security/users`;

export const resetPassword = async (id: string, data: TResetPasswordFormData, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${RESET_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data)
  );
};