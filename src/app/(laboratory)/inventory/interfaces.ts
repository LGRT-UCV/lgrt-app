import type { FormInstance } from "antd/lib";
import type { IGenericId } from "@/types/app";
import type { TFields } from "./materialType/interfaces";

export type TMaterialForm = {
  name: string;
  description: string;
  imageUrl?: string;
  quantity: string;
  minQuantity?: string;
  superUse: boolean;
  sensibleMaterial: boolean;
  materialType: string;
  measurement: string;
  nfpaBlue: number;
  nfpaRed: number;
  nfpaYellow: number;
  nfpaWhite: string;
  sgaClassif: Array<string>;
  presentation?: string;
  brand?: string;
  batch?: string;
  concentration?: string;
  storagePlace: string;
  expirationDate?: string;
  observations?: string;
  condition?: string;
  weight?: string;
  additionalInfo?: string;
  capacity?: string;
  code?: string;
};

export interface IMaterial {
  name: string;
  description: string;
  imageUrl: string;
  quantity: string;
  minQuantity: string;
  superUse: boolean;
  sensibleMaterial: boolean;
  nfpaClassif: {
    nfpaBlue: number;
    nfpaRed: number;
    nfpaYellow: number;
    nfpaWhite: string;
  };
  sgaClassif: Array<{ idSgaClassif: string } | undefined>;
  presentation?: string;
  brand?: string;
  batch?: string;
  concentration?: string;
  expirationDate?: string;
  observations?: string;
  condition?: string;
  weight?: string;
  additionalInfo?: string;
  capacity?: string;
  code?: string;
}

export type TCustomFieldValue = {
  idMaterialField: string;
  value: string;
};

export type TCustomFieldValues = {
  customFieldValues: Array<TCustomFieldValue>;
};

export type TMaterial = IMaterial &
  IGenericId & { measurement: TMeasurements } & {
    materialType: TMaterialType;
  } & { storagePlace: TStoragePlace } & TCustomFieldValues;

export type TSaveMaterial = IMaterial &
  TMaterialTypeRequest &
  TMesurementsRequest &
  TStoragePlaceRequest &
  TCustomFieldValues;

export interface IMaterialForm {
  formIntance: FormInstance;
  materialData?: TMaterial;
}

export type TMaterialTypeRequest = {
  materialType: IGenericId;
};

export type TMesurementsRequest = {
  measurement: IGenericId;
};

export type TStoragePlaceRequest = {
  storagePlace: IGenericId;
};

export type TMaterialType = {
  id: string;
  name: string;
  fields: string;
  customFields: Array<TFields>;
};

export type TMeasurements = {
  id: string;
  name: string;
  description: string;
};

export type TSGAClassification = {
  id: number;
  name: string;
  description: string;
  iconImage: string;
};

export type TStoragePlace = {
  id: string;
  name: string;
  description: string;
};
