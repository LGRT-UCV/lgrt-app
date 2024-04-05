export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/password/reset?id=${email}`,
    {
      method: "POST",
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok)
    throw new Error(
      `Error: ${JSON.stringify(await response.json())}`,
    );

  return await response.json();
};