import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import type { ILaboratory, TSaveLaboratory } from "./interfaces";

export const LAB_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/security/laboratories`;

export const deleteLaboratory = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${LAB_URI}/${id}`,
    RequestMethods.DELETE,
    headers,
  );
};

export const getAllLaboratories = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    LAB_URI,
    RequestMethods.GET,
    headers,
  );
  return response as Array<ILaboratory>;
};

export const getLaboratory = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    `${LAB_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as ILaboratory;
};

export const createLaboratory = async (data: TSaveLaboratory, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    LAB_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data)
  );
};

export const updateLaboratory = async (id: string, data: TSaveLaboratory, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${LAB_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data)
  );
};

export const laboratoryFields = [
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
  { 
    id: "area",
    label: "Área",
  },
];