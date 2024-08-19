import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

export type TSaveMaterialType = {
  name?: string;
  description?: string;
};

export interface IMaterialType extends IGenericId {
  name: string;
  fields?: string;
}

export type TMaterialType = IMaterialType;

export interface IMaterialTypeForm {
  formIntance: FormInstance;
  MaterialTypeData?: TMaterialType;
}
