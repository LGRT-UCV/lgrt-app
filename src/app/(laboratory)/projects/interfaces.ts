
export type TSaveProject = {
  name: string,
  description: string,
  comments: string,
  status: string,
  fileUri: string,
  projectManager: string,
  file: Array<string>,
  projectMaterial: Array<TProjectMaterial>,
};

export type TProjectMaterial = {
  idMaterial: string,
  quantity: string,
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
