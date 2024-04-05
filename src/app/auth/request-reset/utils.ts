export const requestResetPassword = async (email: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/password/forgot?id=${email}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok)
    throw new Error(
      `Error: ${JSON.stringify(await response.json())}`,
    );

  return await response.json();
};