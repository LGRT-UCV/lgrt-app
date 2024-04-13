import type { FormInstance } from "antd/lib";

interface IGenericId {
  id: string;
}

export interface IMaterial {
  name: string;
  description: string;
  presentation: string;
  quantity: string;
  brand: string;
  batch: string;
  concentration: string;
  storagePlace: string;
  expirationDate: string;
  observations: string;
  condition: string;
  weight: string;
  additionalInfo: string;
  capacity: string;
  code: string;
  superUse: boolean;
  sensibleMaterial: boolean;
  materialType: string;
  measurement: string;
  nfpaClassif: {
    nfpaBlue: number;
    nfpaRed: number;
    nfpaYellow: number;
    nfpaWhite: string;
  };
  sgaClassif: Array<{ idSgaClassif: string }>
};

export type TMaterial = IMaterial & IGenericId;

export interface IMaterialForm {
  formIntance: FormInstance;
};

export type TMaterialType = {
  name: string;
  fields: string;
  id: string;
};

export type TMeasurements = {
  name: string;
  description: string;
  id: string;
}

export type TSGAClassification = {
  name: string;
  description: string;
  id: number;
};