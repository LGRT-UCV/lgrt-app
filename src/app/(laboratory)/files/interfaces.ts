import type { IGenericId } from "@/types/app";
import type { FormInstance } from "antd/lib";

export type TSaveFile = {
  name?: string,
  fileType?: string,
  description?: string,
  file?: Array<string>,
};

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
