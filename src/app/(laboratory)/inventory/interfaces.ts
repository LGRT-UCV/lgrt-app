import type { FormInstance } from "antd/lib";

interface IGenericId {
  id: string;
}

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
  storagePlace: string;
  expirationDate?: string;
  observations?: string;
  condition?: string;
  weight?: string;
  additionalInfo?: string;
  capacity?: string;
  code?: string;
};

export type TMaterial = IMaterial & IGenericId & { measurement: TMeasurements } & { materialType: TMaterialType };
export type TCreateMaterial = IMaterial & TMaterialTypeRequest & TMesurementsRequest;

export interface IMaterialForm {
  formIntance: FormInstance;
};

export type TMaterialTypeRequest = {
  materialType: IGenericId;
};

export type TMesurementsRequest = {
  measurement: IGenericId;
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