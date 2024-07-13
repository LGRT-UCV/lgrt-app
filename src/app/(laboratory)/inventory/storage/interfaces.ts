import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

export type TSaveStorage = {
  name?: string;
  description?: string;
};

export interface IStorage extends IGenericId {
  name: string;
  description?: string;
};

export type TStorage = IStorage;

export interface IStorageForm {
  formIntance: FormInstance;
  StorageData?: TStorage;
};