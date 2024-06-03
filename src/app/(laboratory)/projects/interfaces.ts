import type { FormInstance } from "antd/lib";

export type TSaveProject = {
  name: string,
  description: string,
  status: string,
  fileUri: string,
  projectManager: string,
  projectMaterial?: Array<TProjectMaterial>;
  comments?: string,
  file?: Array<string>,
};

export type TProjectMaterial = {
  idMaterial: string,
  quantity: string | number,
};

export interface IProject {
  id: string,
  name: string,
  description: string,
  comments: string,
  status: string,
  fileUri: string,
  projectManager: string,
  file: string | null,
  projectMaterial: Array<TProjectMaterial>,
};

export interface IProjectForm {
  formIntance: FormInstance;
  projectData?: IProject;
};
