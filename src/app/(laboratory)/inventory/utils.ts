import { newRequest, RequestMethods } from "@/utils/requests";

const MATERIAL_TYPE_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materialTypes`;
const MATERIALS = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materials`;


export const getMaterialTypes = async () => {
  return newRequest(
    MATERIAL_TYPE_URI,
    RequestMethods.GET
  );
};

export const getAllMaterials = async () => {
  return newRequest(
    MATERIALS,
    RequestMethods.GET
  );
};