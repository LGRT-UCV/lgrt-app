export enum Routes {
  Files = "/files",
  Home = "/",
  Inventory = "/inventory",
  Login = "/auth/login",
  Laboratory = "/admin/laboratory",
  SaveMaterial = "/inventory/material",
  Projects = "/projects",
  Storage = "/inventory/storage",
  SaveProject = "/projects/project",
  Requests = "/requests",
  RequestResetPassword = "/auth/request-reset",
  ResetPassword = "/auth/reset-password",
  Profile = "/profile",
  Users = "/admin/users",
  SaveUser = "/admin/users/user",
};

export enum Roles {
  Admin = "Admin",
  Personal = "Personal",
  External = "External",
};

export const LAB_DETAILS = {
  name: "Laboratorio de Granos Raíces y Tubérculos",
  longName: "Laboratorio de Granos Raíces y Tubérculos de la Facultad de Ciencias de la UCV",
  shortName: "LGRT UCV",
  symbol: "LGRT",
  address: "",
};
