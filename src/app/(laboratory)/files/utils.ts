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

export const getFileURI = async (
  fileUri: string,
  fileType: string,
  sessionToken: string,
) => {
  const contentType = getContentTypeByFileType(fileType);
  const headers = {
    "Content-Type": `application/${contentType}`,
    Authorization: `Bearer ${sessionToken}`,
  };
  const requestURI = `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${fileUri}`;
  const response = await fetch(requestURI, {
    method: RequestMethods.GET,
    headers,
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(new Blob([blob]));
  return url;
};

const getContentTypeByFileType = (fileType: string) => {
  switch (fileType) {
    case ".pdf":
      return "application/pdf";
    case ".doc":
      return "application/msword";
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".xls":
      return "application/vnd.ms-excel";
    case ".xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".ppt":
      return "application/vnd.ms-powerpoint";
    case ".pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case ".jpg":
      return "image/jpeg";
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".tiff":
      return "image/tiff";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
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
