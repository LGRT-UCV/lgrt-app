import type { FormInstance } from "antd/lib";
import type { IGenericId } from "@/types/app";

export type TMaterialForm = {
  name: string;
  description: string;
  quantity: string;
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
  quantity: string;
  superUse: boolean;
  sensibleMaterial: boolean;
  nfpaClassif: {
    nfpaBlue: number;
    nfpaRed: number;
    nfpaYellow: number;
    nfpaWhite: string;
  };
  sgaClassif: Array<{ idSgaClassif: string } | undefined>
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
};

export type TMaterial = IMaterial & IGenericId & { measurement: TMeasurements } & { materialType: TMaterialType } & { storagePlace: TStoragePlace };
export type TSaveMaterial = IMaterial & TMaterialTypeRequest & TMesurementsRequest & TStoragePlaceRequest;

export interface IMaterialForm {
  formIntance: FormInstance;
  materialData?: TMaterial;
};

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
};

export type TMeasurements = {
  id: string;
  name: string;
  description: string;
}

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
