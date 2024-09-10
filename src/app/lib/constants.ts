export enum Routes {
  Files = "/files",
  Home = "/",
  Credits = "/credits",
  Inventory = "/inventory",
  Login = "/auth/login",
  Laboratory = "/admin/laboratory",
  MaterialType = "/inventory/materialType",
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
}

export enum Roles {
  Admin = "Admin",
  PersonalExtra = "PersonalExtra",
  Personal = "Personal",
  External = "Externo",
}

export const LAB_DETAILS = {
  appName: "LGRT App",
  name: "Laboratorio de Granos Raíces y Tubérculos",
  longName:
    "Laboratorio de Granos Raíces y Tubérculos de la Facultad de Ciencias de la UCV",
  shortName: "LGRT UCV",
  symbol: "LGRT",
  address: "",
};

export const credits = [
  { role: "autor", name: "Br. Diego Chacón" },
  { role: "autor", name: "Br. Carlos Pino" },
  { role: "tutor", name: "Profesora Yosly Hernández" },
  { role: "tutor", name: "Profesor Romel Guzmán" },
];
