import { Tag } from "antd";
import type { IProject } from "../../interfaces";

interface IDetailsModal {
  project?: IProject
};

export default function DetailsModal ({
  project,
}: IDetailsModal) {
  if (typeof project === "undefined") return <></>;
  
  return (
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">{project.name}</h2>
        <Tag color={project.status === "Activo" ? "green" : "red"}>
          {project.status}
        </Tag>
      </div>
      <div className="p-4 space-y-4">
        <div className="w-full">
          <strong>Descripción:</strong>
          <br />
          <p>{project.description}</p>
        </div>
        <div className="w-full grid grid-cols-2 space-y-4">
          <div className="mt-4">
            <strong>Responsable:</strong> {project.projectManager}
          </div>
          <div>
            <a href={project.fileUri} target="_blank"><strong>Ver Archivo</strong></a>
          </div>
        </div>
      </div>
    </div>
  );
};