import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

export type TStatus = "P" | "A" | "E" | "D" | "R";

export type TRequestStatus = {
  label: string;
  value: TStatus;
};

export type TUpdateRequestStatus = {
  status?: TStatus;
  commentsRequester?: string;
  commentsResponsible?: string;
  commentsRequesterReturn?: string;
  commentsResponsibleReturn?: string;
};

export type TSaveRequest = {
  dropDate?: string;
  returnDate?: string;
  idRequester?: IGenericId;
  idResponsibleDrop?: IGenericId;
  requesterReturn?: IGenericId;
  idResponsibleReturn?: IGenericId;
  materialRequestMaterial?: Array<TRequestMaterial>;
} & TUpdateRequestStatus;

export type TRequestMaterial = {
  idMaterial: string;
  quantity: string | number;
};

export type TLaboratory = {
  id: string;
  name: string;
};

export interface IUser extends IGenericId {
  name: string;
  lastName: string;
  laboratory: TLaboratory;
};

export type TUser = IUser;

export interface IRequest {
  id: string;
  commentsRequester: string;
  commentsResponsible: string;
  commentsRequesterReturn: string;
  commentsResponsibleReturn: string;
  idRequester: TUser;
  idResponsibleDrop: TUser | null;
  requesterReturn: TUser | null;
  idResponsibleReturn: TUser | null;
  status: TStatus;
  materialRequestMaterial: Array<TRequestMaterial>;
  dropDate: string;
  returnDate: string;
  dateupd: string;
  datecre: string;
};

export interface IRequestForm {
  formIntance: FormInstance;
  RequestData?: IRequest;
};
