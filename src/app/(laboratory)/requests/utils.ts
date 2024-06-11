import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import type { IRequest, TSaveRequest, TUpdateRequestStatus } from "./interfaces";

export const REQUEST_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/request/materialrequests`;

export const deleteRequest = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${REQUEST_URI}/${id}`,
    RequestMethods.DELETE,
    headers,
  );
};

export const getAllRequests = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    REQUEST_URI,
    RequestMethods.GET,
    headers,
  );
  return response as Array<IRequest>;
};

export const getRequest = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    `${REQUEST_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IRequest;
};

export const createRequest = async (data: TSaveRequest, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    REQUEST_URI + "/",
    RequestMethods.POST,
    headers,
    JSON.stringify(data)
  );
};

export const updateRequest = async (id: string, data: TSaveRequest, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${REQUEST_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data)
  );
};

export const updateRequestStatus = async (id: string, data: TUpdateRequestStatus, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${REQUEST_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data)
  );
};

export const getStatus = (status: string) => {
  switch (status) {
    case "A":
      return {
        status: "Aprobado",
        statusColor: "green",
      };
    case "R":
      return {
        status: "Rechazado",
        statusColor: "red",
      };
    case "E":
      return {
        status: "Entregado",
        statusColor: "green",
      };
    case "D":
      return {
        status: "Devuelto",
        statusColor: "green",
      };
    default:
      return {
        status: "Pendiente",
        statusColor: "orange",
      };
  };
};

export const requestFields = [
  {
    id: "id",
    label: "#",
  },
  { 
    id: "idRequester",
    label: "Nombre del solicitante",
  },
  { 
    id: "status",
    label: "Status",
  },
  { 
    id: "updateDate",
    label: "Fecha de actualización",
  },
];