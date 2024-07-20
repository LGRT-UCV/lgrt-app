import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type { IFile, TSaveFile } from "./interfaces";

export const FILE_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/quality/files`;

export const deleteFile = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(`${FILE_URI}/${id}`, RequestMethods.DELETE, headers);
};

export const getAllFiles = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(FILE_URI, RequestMethods.GET, headers);
  return response as Array<IFile>;
};

export const getFile = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(
    `${FILE_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IFile;
};

export const createFile = async (data: TSaveFile, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    FILE_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data),
  );
};

export const updateFile = async (
  id: string,
  data: TSaveFile,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${FILE_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};

export const fileFields = [
  {
    id: "name",
    label: "Nombre del archivo",
  },
  {
    id: "fileType",
    label: "Tipo de archivo",
  },
  {
    id: "description",
    label: "Descripción",
  },
];
