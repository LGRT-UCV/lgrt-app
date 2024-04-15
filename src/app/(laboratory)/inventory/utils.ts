import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import { TCreateMaterial, TMaterial } from "./interfaces";

const MATERIAL_TYPE_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materialtypes`;
const MATERIALS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materials`;
const MEASUREMENTS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/measurements`;
const SGA_CLASSIGICATIONS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/sgaclassifications`;

export const getMaterialTypes = async () => {
  return newRequest(
    MATERIAL_TYPE_URI,
    RequestMethods.GET
  );
};

export const getMeasurements = async () => {
  return newRequest(
    MEASUREMENTS_URI,
    RequestMethods.GET
  );
};

export const getSGAClassification = async () => {
  return newRequest(
    SGA_CLASSIGICATIONS_URI,
    RequestMethods.GET
  );
};

export const deleteMaterial = async () => {
  return newRequest(
    MATERIALS_URI,
    RequestMethods.DELETE
  );
};

export const getAllMaterials = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    MATERIALS_URI,
    RequestMethods.GET,
    headers,
  );
  return response as Array<TMaterial>;
};

export const createMaterial = async (data: TCreateMaterial, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    MATERIALS_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data)
  );
};