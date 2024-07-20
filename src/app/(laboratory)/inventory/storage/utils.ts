import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type { IStorage, TSaveStorage } from "./interfaces";

export const LAB_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/storageplaces`;

export const deleteStorage = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(`${LAB_URI}/${id}`, RequestMethods.DELETE, headers);
};

export const getAllStorages = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(LAB_URI, RequestMethods.GET, headers);
  return response as Array<IStorage>;
};

export const getStorage = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(
    `${LAB_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IStorage;
};

export const createStorage = async (
  data: TSaveStorage,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    LAB_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data),
  );
};

export const updateStorage = async (
  id: string,
  data: TSaveStorage,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${LAB_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};

export const storageFields = [
  {
    id: "id",
    label: "#",
  },
  {
    id: "name",
    label: "Nombre",
  },
  {
    id: "description",
    label: "Descripción",
  },
];
