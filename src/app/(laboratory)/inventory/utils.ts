import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type {
  TSaveMaterial,
  TMaterial,
  TMaterialType,
  TMeasurements,
  TSGAClassification,
  TStoragePlace,
} from "./interfaces";

const MATERIAL_TYPE_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materialtypes`;
const MATERIALS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materials`;
const MEASUREMENTS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/measurements`;
const SGA_CLASSIGICATIONS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/sgaclassifications`;
const SGA_STORAGE_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/storageplaces`;

export const getMaterialTypes = async () => {
  const response = await newRequest(MATERIAL_TYPE_URI, RequestMethods.GET);
  return response as Array<TMaterialType>;
};

export const getMeasurements = async () => {
  const response = await newRequest(MEASUREMENTS_URI, RequestMethods.GET);
  return response as Array<TMeasurements>;
};

export const getSGAClassification = async () => {
  const response = await newRequest(
    SGA_CLASSIGICATIONS_URI,
    RequestMethods.GET,
  );
  return response as Array<TSGAClassification>;
};

export const getStoragePlaces = async () => {
  const response = await newRequest(SGA_STORAGE_URI, RequestMethods.GET);
  return response as Array<TStoragePlace>;
};

export const deleteMaterial = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(`${MATERIALS_URI}/${id}`, RequestMethods.DELETE, headers);
};

export const getAllMaterials = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(MATERIALS_URI, RequestMethods.GET, headers);
  return response as Array<TMaterial>;
};

export const getMaterial = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(
    `${MATERIALS_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as TMaterial;
};

export const createMaterial = async (
  data: TSaveMaterial,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    MATERIALS_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data),
  );
};

export const updateMaterial = async (
  id: string,
  data: TSaveMaterial,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${MATERIALS_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};
