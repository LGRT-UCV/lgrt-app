import type { TTaskStatus } from "../../interfaces";

export const getStatus = (status: TTaskStatus) => {
  switch (status) {
    case "P":
      return {
        status: "Pendiente",
        statusColor: "gray",
      };
    case "E":
      return {
        status: "Rechazado",
        statusColor: "orange",
      };
    case "F":
      return {
        status: "Entregado",
        statusColor: "green",
      };
    default:
      return {
        status: "Cancelado",
        statusColor: "green",
      };
  }
};
