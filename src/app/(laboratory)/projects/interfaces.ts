import type { FormInstance } from "antd/lib";

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

export interface IProject {
  id: string;
  name: string;
  description: string;
  comments: string;
  status: string;
  fileUri: string;
  projectUri: string;
  projectManager: string;
  file: string | null;
  projectMaterial: Array<TProjectMaterial>;
}

export interface IProjectForm {
  formIntance: FormInstance;
  projectData?: IProject;
}
