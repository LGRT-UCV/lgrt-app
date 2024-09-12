import type { FormInstance } from "antd/lib";
import type { IGenericId } from "@/types/app";

export type TSaveProject = {
  name: string;
  description: string;
  status: string;
  projectUri: string;
  fileUri?: string;
  projectManager: string;
  projectMaterial?: Array<TProjectMaterial>;
  comments?: string;
  file?: Array<string>;
  projectTasks?:
    | Array<string>
    | {
        name: string;
      }[];
};

export type TUpdateProject = {
  status?: string;
  comments?: string;
};

export type TProjectMaterial = {
  idMaterial: string;
  quantity: string | number;
};

export interface IProject extends IGenericId {
  name: string;
  description: string;
  comments: string;
  status: string;
  fileUri: string;
  projectUri: string;
  projectManager: string;
  file: string | null;
  projectMaterial: Array<TProjectMaterial>;
  projectTasks: Array<TProjectTask>;
}

export interface IProjectForm {
  formIntance: FormInstance;
  projectData?: IProject;
}

export enum ETaskStatus {
  P = "P",
  E = "E",
  C = "C",
  D = "D",
}

export type TTaskStatus = keyof typeof ETaskStatus;

export interface ISaveProjectTask {
  name: string;
  description: string;
  idProject: string;
  projectTasksMaterials: Array<TProjectMaterial>;
  status: TTaskStatus;
}

export interface IProjectTask extends IGenericId, ISaveProjectTask {}

export type TSaveProjectTask = ISaveProjectTask;
export type TProjectTask = IProjectTask;
