import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

export type TSaveFile = {
  name?: string,
  fileType?: string,
  description?: string,
  file?: string,
};

export type TFileForm = {
  name: string,
  description: string,
  file: {
    file: File,
    fileList: Array<TFile>,
  }
};

export type TFile = {
  originFileObj: File,
} & File;

export interface IFile extends IGenericId {
  name: string,
  fileType: string,
  description: string,
  file: Array<string>,
};

export interface IFileForm {
  formIntance: FormInstance;
  FileData?: IFile;
};
