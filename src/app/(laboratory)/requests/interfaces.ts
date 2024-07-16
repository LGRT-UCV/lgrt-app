import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";
import type { TUser } from "../admin/users/interfaces";

export enum RequestStatus {
  Pending = "P",
  Approved = "A",
  Delivered = "E",
  Returned = "D",
  Rejected = "R",
};

export type TStatus = typeof RequestStatus[keyof typeof RequestStatus];

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
