import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";
import type { TLaboratory } from "../laboratory/interfaces";

export type TSaveUser = {
  name: string;
  lastName: string;
  identificationNumber: string;
  idRoleId?: string;
  laboratory?: IGenericId;
} & IGenericId;

export type TUserForm = {
  name: string;
  identificationNumber: string;
  lastName: string;
  idRoleId: string;
  laboratory: string;
} & IGenericId;

export interface IUser extends IGenericId {
  name: string;
  lastName: string;
  identificationNumber: string;
  status: TStatus;
  idRoleId: string;
  laboratory: TLaboratory;
};

export type TUser = IUser;

export interface IUserForm {
  formIntance: FormInstance;
  UserData?: TUser;
};

export type TStatus = "A" | "I";

export type TUserStatus = {
  label: string;
  value: TStatus;
};