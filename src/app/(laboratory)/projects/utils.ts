import { newRequest, RequestMethods, API_REQUEST_HEADERS } from "@/utils/requests";
import type { IProject, TSaveProject } from "./interfaces";

export const PROJECT_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/project/projects`;

export const getProjectFiles = async (id: string) => {
  const response = await newRequest(
    `${PROJECT_URI}/files/${id}`,
    RequestMethods.GET,
  );
  return response as string;
};

export const deleteProject = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${PROJECT_URI}/${id}`,
    RequestMethods.DELETE,
    headers,
  );
};

export const getAllProjects = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    PROJECT_URI + "/",
    RequestMethods.GET,
    headers,
  );
  return response as Array<IProject>;
};

export const getProject = async (sessionToken: string, id: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  const response = await newRequest(
    `${PROJECT_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IProject;
};

export const createProject = async (data: TSaveProject, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    PROJECT_URI + "/",
    RequestMethods.POST,
    headers,
    JSON.stringify(data)
  );
};

export const updateProject = async (id: string, data: TSaveProject, sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`
  };
  return newRequest(
    `${PROJECT_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data)
  );
};

export const fieldsProject = [
  { 
    id: "name",
    label: "Nombre",
  },
  { 
    id: "description",
    label: "Descripción",
  },
  { 
    id: "comments",
    label: "Comentarios",
  },
  { 
    id: "status",
    label: "Status",
  },
  { 
    id: "fileUri",
    label: "Link del archivo",
  },
  { 
    id: "file",
    label: "Archivo",
  },
  { 
    id: "projectMaterial",
    label: "Materiales",
  },
];
