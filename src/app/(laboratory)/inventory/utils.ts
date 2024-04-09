import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import { IMaterial } from "./interfaces";

const MATERIAL_TYPE_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materialTypes`;
const MATERIALS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materials`;


export const getMaterialTypes = async () => {
  return newRequest(
    MATERIAL_TYPE_URI,
    RequestMethods.GET
  );
};

export const deleteMaterial = async () => {
  return newRequest(
    MATERIALS_URI,
    RequestMethods.GET
  );
};

export const getAllMaterials = async () => {
  const response = await newRequest(
    MATERIALS_URI,
    RequestMethods.DELETE
  );
  return response as IMaterial;
};

export const createMaterial = async (data: IMaterial, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    MATERIALS_URI,
    RequestMethods.POST,
    JSON.stringify(data),
    headers
  );
};