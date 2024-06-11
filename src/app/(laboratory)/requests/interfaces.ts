import type { FormInstance } from "antd/lib";

export type TSaveRequest = {
  commentsRequester?: string;
  commentsResponsible?: string;
  dropDate?: string;
  returnDate?: string;
  commentsRequesterReturn?: string;
  commentsResponsibleReturn?: string;
  idRequester?: string;
  idResponsibleDrop?: string;
  requesterReturn?: string;
  idResponsibleReturn?: string;
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

export interface IRequest {
  id: string;
  commentsRequester: string;
  commentsResponsible: string;
  dropDate: string;
  returnDate: string;
  commentsRequesterReturn: string;
  commentsResponsibleReturn: string;
  idRequester: string;
  idResponsibleDrop: string;
  requesterReturn: string;
  idResponsibleReturn: string;
  status: string;
  materialRequestMaterial: Array<TRequestMaterial>;
};

export interface IRequestForm {
  formIntance: FormInstance;
  RequestData?: IRequest;
};
