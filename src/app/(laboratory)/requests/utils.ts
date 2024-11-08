import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import {
  RequestStatus,
  type IRequest,
  type TRequestStatus,
  type TSaveRequest,
  type TStatus,
  type TUpdateRequestStatus,
} from "./interfaces";

export const REQUEST_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/request/materialrequests`;

export const deleteRequest = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(`${REQUEST_URI}/${id}`, RequestMethods.DELETE, headers);
};

export const getAllRequests = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(REQUEST_URI, RequestMethods.GET, headers);
  return response as Array<IRequest>;
};

export const getRequest = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(
    `${REQUEST_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IRequest;
};

export const createRequest = async (
  data: TSaveRequest,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    REQUEST_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data),
  );
};

export const updateRequest = async (
  id: string,
  data: TSaveRequest,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${REQUEST_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};

export const updateRequestStatus = async (
  id: string,
  data: TUpdateRequestStatus,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${REQUEST_URI}/${id}/statuschange`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};

export const requestStatus: Array<TRequestStatus> = [
  {
    label: "Pendiente",
    value: RequestStatus.Pending,
  },
  {
    label: "Rechazado",
    value: RequestStatus.Rejected,
  },
  {
    label: "Aprobado",
    value: RequestStatus.Approved,
  },
  {
    label: "Entregado",
    value: RequestStatus.Delivered,
  },
  {
    label: "Devuelto",
    value: RequestStatus.Returned,
  },
];

export const getStatus = (status: TStatus) => {
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
  }
};

export const requestFields = [
  {
    id: "id",
    label: "#",
  },
  {
    id: "requester",
    label: "Nombre del solicitante",
  },
  {
    id: "status",
    label: "Estado",
  },
  {
    id: "dateupd",
    label: "Última actualización",
  },
];
