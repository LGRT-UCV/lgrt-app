import { Button, Select, Tag } from "antd";
import type { IProject, TUpdateProject } from "../../interfaces";
import { useMemo, useState } from "react";
import { SelectProps } from "antd/lib";
import { updateProject } from "../../utils";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";

type TagRender = SelectProps["tagRender"];

interface IDetailsModal {
  project?: IProject
};

export default function DetailsModal ({
  project,
}: IDetailsModal) {
  const [statusSelected, setStatusSelected] = useState<string>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  if (typeof project === "undefined") return <></>;

  const { status, statusColor } = useMemo(() => {
    switch (project.status) {
      case "active":
        return {
          status: "Activo",
          statusColor: "green",
        };
      default:
        return {
          status: "Inactivo",
          statusColor: "red",
        };
    }
  }, [project.status]);

  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
      >
        {label}
      </Tag>
    );
  };

  const onChangeStatus = async () => {
    try {
      const sessionToken = sessionData?.user.token ?? "";
      const data: TUpdateProject = {
        status: statusSelected,
      };
      await updateProject(project.id, data, sessionToken);
      openNotification(
        "success",
        "Proyecto actualizado con exito",
        `El status ${statusSelected} ha sido guardado con exito.`,
        "topRight"
      );
    } catch (error) {
      openNotification(
        "error",
        "Error al guardar el proyecto",
        "Ha ocurrido un error al cambiar el status del proyecto",
        "topRight"
      );
      console.log("ERROR: ", error);
    }
  };
  
  return (<>
    {notificationElement}
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">{project.name}</h2>
        <Tag color={statusColor}>
          {status}
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
        <div className="w-full grid grid-cols-2 space-y-4">
          <div className="flex gap-2 items-center">
            <strong>Cambiar status:</strong>
            <Select
              tagRender={tagRender}
              defaultValue={[project.status ?? "inactive"]}
              onSelect={value => setStatusSelected(value)}
              style={{ width: "100%" }}
              options={[
                {
                  label: "Activo",
                  value: "active",
                },
                {
                  label: "Inactivo",
                  value: "inactive",
                },
                {
                  label: "En revisión",
                  value: "reviewing",
                },
                {
                  label: "Finalizado",
                  value: "done",
                },
              ]}
            />
          </div>
            
          <Button onClick={onChangeStatus}>Cambiar</Button>
        </div>
      </div>
    </div>
  </>);
};