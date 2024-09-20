import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type { IProject, TSaveProject, TUpdateProject } from "./interfaces";

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
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(`${PROJECT_URI}/${id}`, RequestMethods.DELETE, headers);
};

export const getAllProjects = async (sessionToken: string) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
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
    Authorization: `Bearer ${sessionToken}`,
  };
  const response = await newRequest(
    `${PROJECT_URI}/${id}`,
    RequestMethods.GET,
    headers,
  );
  return response as IProject;
};

export const createProject = async (
  data: TSaveProject,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    PROJECT_URI + "/",
    RequestMethods.POST,
    headers,
    JSON.stringify(data),
  );
};

export const updateProject = async (
  id: string,
  data: TUpdateProject,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${PROJECT_URI}/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};

export const fieldsProject = [
  {
    id: "id",
    label: "ID",
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
    id: "comments",
    label: "Comentarios",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "projectUri",
    label: "URL",
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

export const projectStatus = [
  {
    label: "Activo",
    value: "A",
  },
  {
    label: "Inactivo",
    value: "I",
  },
  {
    label: "En revisión",
    value: "R",
  },
  {
    label: "Finalizado",
    value: "D",
  },
];

export const getProjectStatus = (status: string) => {
  return (
    projectStatus.find((project) => project.value === status) ?? {
      label: "Inactivo",
      value: "I",
    }
  );
};

export const getProjectStatusStyle = (status: string) => {
  switch (status) {
    case "A":
      return {
        status: "Activo",
        statusColor: "green",
      };
    case "R":
      return {
        status: "En revisión",
        statusColor: "orange",
      };
    case "D":
      return {
        status: "Finalizado",
        statusColor: "blue",
      };
    default:
      return {
        status: "Inactivo",
        statusColor: "red",
      };
  }
};
