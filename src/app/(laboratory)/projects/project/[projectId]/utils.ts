import {
  newRequest,
  RequestMethods,
  API_REQUEST_HEADERS,
} from "@/utils/requests";
import type { TSaveProjectTask, TTaskStatus } from "../../interfaces";

const TASKS_URI = `${process.env.NEXT_PUBLIC_API_URL}/v1/project/projects`;

export const updateProjectTask = async (
  id: string,
  projectId: string,
  data: TSaveProjectTask,
  sessionToken: string,
) => {
  const headers = {
    ...API_REQUEST_HEADERS,
    Authorization: `Bearer ${sessionToken}`,
  };
  return newRequest(
    `${TASKS_URI}/${projectId}/projectasks/${id}`,
    RequestMethods.PUT,
    headers,
    JSON.stringify(data),
  );
};

export const getTaskStatus = (status: TTaskStatus) => {
  switch (status) {
    case "P":
      return {
        status: "Por hacer",
        statusColor: "gray",
      };
    case "E":
      return {
        status: "En progreso",
        statusColor: "orange",
      };
    case "C":
      return {
        status: "Completado",
        statusColor: "green",
      };
    default:
      return {
        status: "Cancelado",
        statusColor: "green",
      };
  }
};