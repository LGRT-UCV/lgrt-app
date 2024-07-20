import { createHash } from "crypto";
import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type { TResetPasswordFormData } from "./interfaces";

export const RESET_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/security/users`;

export const resetPassword = async (
  id: string,
  data: TResetPasswordFormData,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };

  const currentPassword = createHash("sha256")
    .update(data.currentPassword)
    .digest("hex")
    .toString();
  const password = createHash("sha256")
    .update(data.newPassword)
    .digest("hex")
    .toString();
  const confirm = createHash("sha256")
    .update(data.passwordConfirmation)
    .digest("hex")
    .toString();
  const requestData: TResetPasswordFormData = {
    currentPassword: currentPassword,
    newPassword: password,
    passwordConfirmation: confirm,
  };

  return newRequest(
    `${RESET_URI}/${id}/changepassword`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(requestData),
  );
};
