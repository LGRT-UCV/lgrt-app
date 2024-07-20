import { newRequest, RequestMethods } from "@/utils/requests";

export const requestResetPassword = async (email: string) => {
  return newRequest(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/password/forgot?id=${email}`,
    RequestMethods.POST,
  );
};
