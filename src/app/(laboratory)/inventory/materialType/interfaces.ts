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
  id?: string;
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
  fields: string;
  customFields: Array<TFields>;
  existentMaterials: string;
}

export type TMaterialType = IMaterialType;

export interface IMaterialTypeForm {
  formIntance: FormInstance;
  MaterialTypeData?: TMaterialType;
}

enum EFieldDefaultType {
  id,
  name,
  description,
  materialType,
  measurement,
  presentation,
  capacity,
  weight,
  quantity,
  brand,
  code,
  batch,
  concentration,
  expirationDate,
  condition,
  storagePlace,
  sensibleMaterial,
  superUse,
  additionalInfo,
  observations,
  nfpaClassif,
  sgaClassif,
}

export type TFieldDefaultType = keyof typeof EFieldDefaultType;

export type TDefaultMaterialFields = {
  id: TFieldDefaultType;
  label: string;
};
