export enum RequestMethods {
  DELETE = "DELETE",
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
};

export const API_REQUEST_HEADERS = { "Content-Type": "application/json" };

export const newRequest = async (
  uri: string,
  method: RequestMethods,
  headers: HeadersInit = API_REQUEST_HEADERS,
  body?: string,
) => {
  const response = await fetch(
    uri,
    {
      method,
      body,
      headers,
    }
  );

  if (!response.ok)
    throw new Error(
      `Error: ${JSON.stringify(await response.json())}`
    );

  return await response.json();
}