import { createHash } from "crypto";
import { newRequest, RequestMethods } from "@/utils/requests";

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const password = createHash("sha256")
    .update(newPassword)
    .digest("hex")
    .toString();
  const confirm = createHash("sha256")
    .update(confirmPassword)
    .digest("hex")
    .toString();

  return await newRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/password/reset?id=${email}`,
    RequestMethods.POST,
    undefined,
    JSON.stringify({
      token,
      newPassword: password,
      confirmPassword: confirm,
    }),
  );
};
