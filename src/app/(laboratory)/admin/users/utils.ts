import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import type { IUser, TSaveUser, TStatus, TUserStatus } from "./interfaces";
import { Roles } from "@/lib/constants";

export const USER_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/security/users`;

export const deleteUser = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${USER_URI}/${id}`,
    RequestMethods.DELETE,
    headers,
  );
};

export const getAllUsers = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    USER_URI,
    RequestMethods.GET,
    headers,
  );
  return response as Array<IUser>;
};

export const getUser = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    `${USER_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IUser;
};

export const createUser = async (data: TSaveUser, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    USER_URI,
    RequestMethods.POST,
    headers,
    JSON.stringify(data)
  );
};

export const updateUser = async (id: string, data: TSaveUser, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${USER_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data)
  );
};

export const requestStatus: Array<TUserStatus> = [
  {
    label: "Activo",
    value: "A",
  },
  {
    label: "Inactivo",
    value: "I",
  },
];

export const getStatus = (status: TStatus) => {
  switch (status) {
    case "A":
      return {
        status: "Activo",
        statusColor: "green",
      };
    default:
      return {
        status: "Inactivo",
        statusColor: "red",
      };
  };
};

export const userRoles = [
  { id: 0, roleName: Roles.Admin },
  { id: 1, roleName: Roles.Personal },
  { id: 2, roleName: Roles.External },
];

export const getUserRole = (roleId: number) => userRoles.find(role => role.id === roleId)?.roleName;

export const userFields = [
  { 
    id: "name",
    label: "Nombre",
  },
  { 
    id: "lastName",
    label: "Apellido",
  },
  { 
    id: "id",
    label: "Email",
  },
  { 
    id: "role",
    label: "Tipo de usuario",
  },
  {
    id: "laboratoryName",
    label: "Laboratorio",
  }
];