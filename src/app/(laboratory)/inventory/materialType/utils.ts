import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type { IMaterialType, TSaveMaterialType } from "./interfaces";

export const LAB_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/inventory/materialtypes`;

export const deleteMaterialType = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(`${LAB_URI}/${id}`, RequestMethods.DELETE, headers);
};

export const getAllMaterialTypes = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(LAB_URI, RequestMethods.GET, headers);
  return response as Array<IMaterialType>;
};

export const getMaterialType = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(
    `${LAB_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IMaterialType;
};

export const createMaterialType = async (
  data: TSaveMaterialType,
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

export const updateMaterialType = async (
  id: string,
  data: TSaveMaterialType,
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

export const materialTypeFields = [
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

export const basicMaterialTypeFields = [
  {
    key: "name",
    name: "Nombre del material",
    fieldType: "default",
    required: true,
  },
  {
    key: "description",
    name: "Descripción",
    fieldType: "default",
    required: true,
  },
  {
    key: "quantity",
    name: "Cantidad",
    fieldType: "default",
    required: true,
  },
  {
    key: "superUse",
    name: "Necesita supervisión",
    fieldType: "default",
    required: true,
  },
  {
    key: "sensibleMaterial",
    name: "Material Sensible",
    fieldType: "default",
    required: true,
  },
  {
    key: "materialType",
    name: "Tipo de material",
    fieldType: "default",
    required: true,
  },
  {
    key: "measurement",
    name: "Unidad de medida",
    fieldType: "default",
    required: true,
  },
  {
    key: "storagePlace",
    name: "Luegar de almacenamiento",
    fieldType: "default",
    required: true,
  },
  {
    key: "presentation",
    name: "Presentación",
    fieldType: "default",
    required: false,
  },
  {
    key: "brand",
    name: "Marca",
    fieldType: "default",
    required: false,
  },
  {
    key: "code",
    name: "Código",
    fieldType: "default",
    required: false,
  },
  {
    key: "batch",
    name: "Lotes",
    fieldType: "default",
    required: false,
  },
  {
    key: "concentration",
    name: "Concentración",
    fieldType: "default",
    required: false,
  },
  {
    key: "expirationDate",
    name: "Fecha de vencimiento",
    fieldType: "default",
    required: false,
  },
  {
    key: "observations",
    name: "Observaciones",
    fieldType: "default",
    required: false,
  },
  {
    key: "nfpaClassif",
    name: "Clasificación NFPA",
    fieldType: "default",
    required: false,
  },
  {
    key: "sgaClassif",
    name: "Clasificación SGA",
    fieldType: "default",
    required: false,
  },
  {
    key: "capacity",
    name: "Capacidad",
    fieldType: "default",
    required: false,
  },
  {
    key: "condition",
    name: "Condición",
    fieldType: "default",
    required: false,
  },
  {
    key: "weight",
    name: "Peso",
    fieldType: "default",
    required: false,
  },
  {
    key: "additionalInfo",
    name: "Información adicional",
    fieldType: "default",
    required: false,
  },
];
