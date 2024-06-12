import type { FormInstance } from "antd/lib";

export type TSaveRequest = {
  commentsRequester?: string;
  commentsResponsible?: string;
  dropDate?: string;
  returnDate?: string;
  commentsRequesterReturn?: string;
  commentsResponsibleReturn?: string;
  idRequester?: TUser;
  idResponsibleDrop?: TUser;
  requesterReturn?: TUser;
  idResponsibleReturn?: TUser;
  status?: string;
  materialRequestMaterial?: Array<TRequestMaterial>;
};

export type TUpdateRequestStatus = {
  status?: string;
};

export type TRequestMaterial = {
  idMaterial: string;
  quantity: string | number;
};

export type TLaboratory = {
  id: string;
  name: string;
};

export interface IUser {
  id: string;
  name: string;
  lastName: string;
  laboratory: TLaboratory;
};

export type TUser = IUser;

export interface IRequest {
  id: string;
  commentsRequester: string;
  commentsResponsible: string;
  dropDate: string;
  returnDate: string;
  commentsRequesterReturn: string;
  commentsResponsibleReturn: string;
  idRequester: TUser;
  idResponsibleDrop: TUser | null;
  requesterReturn: TUser | null;
  idResponsibleReturn: TUser | null;
  status: string;
  materialRequestMaterial: Array<TRequestMaterial>;
  dateupd: string;
};

export interface IRequestForm {
  formIntance: FormInstance;
  RequestData?: IRequest;
};
