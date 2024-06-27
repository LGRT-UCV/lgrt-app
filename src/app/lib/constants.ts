export enum Routes {
  Files = "/files",
  Home = "/",
  Inventory = "/inventory",
  Login = "/auth/login",
  Laboratory = "/admin/laboratory",
  SaveMaterial = "/inventory/material",
  Projects = "/projects",
  SaveProject = "/projects/project",
  Requests = "/requests",
  RequestResetPassword = "/auth/request-reset",
  ResetPassword = "/auth/reset-password",
  Profile = "/profile",
  Users = "/admin/users",
  SaveUser = "/admin/users/user",
};

export enum Roles {
  External = "external",
  Internal = "internal",
  Admin = "admin",
};

export const LAB_DETAILS = {
  name: "Laboratorio de Granos Raíces y Tubérculos",
  longName: "Laboratorio de Granos Raíces y Tubérculos de la Facultad de Ciencias de la UCV",
  shortName: "LGRT UCV",
  symbol: "LGRT",
  address: "",
};
