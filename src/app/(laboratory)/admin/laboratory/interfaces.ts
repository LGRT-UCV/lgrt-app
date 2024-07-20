import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

export type TSaveLaboratory = {
  name: string;
  description?: string;
  area?: string;
  status?: string;
};

export interface ILaboratory extends IGenericId {
  name: string;
  description?: string;
  area?: string;
  status?: string;
}

export type TLaboratory = ILaboratory;

export interface ILaboratoryForm {
  formIntance: FormInstance;
  LaboratoryData?: TLaboratory;
}
