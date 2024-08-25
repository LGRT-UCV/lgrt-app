import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

enum EFieldType {
  default,
  date,
  string,
  list,
}

export type TFieldType = keyof typeof EFieldType;

export type TFields = {
  name: string;
  fieldType: TFieldType;
  fieldList?: string | Array<string>;
};

export type TSaveMaterialType = {
  name: string;
  fields: Array<TFields>;
};

export type TSaveMaterialTypeForm = {
  name: string;
  predefinedFields: Array<string>;
  customFields: Array<TFields>;
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
