import { Button, Select, Tag } from "antd";
import type { IProject, TUpdateProject } from "../../interfaces";
import { useEffect, useMemo, useState } from "react";
import { SelectProps } from "antd/lib";
import { updateProject } from "../../utils";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";
import { Roles } from "@/lib/constants";
import { useLabProvider } from "@/context/labProvider";

type TagRender = SelectProps["tagRender"];

interface IDetailsModal {
  project?: IProject;
  closeModal: () => void;
}

export default function DetailsModal({ project, closeModal }: IDetailsModal) {
  const { role } = useLabProvider();
  const [statusSelected, setStatusSelected] = useState<string>();
  const [currentMaterials, setCurrentMaterials] = useState<Array<TMaterial>>(
    [],
  );
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  if (typeof project === "undefined") return <></>;

  const { status, statusColor } = useMemo(() => {
    switch (project.status) {
      case "A":
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

  useEffect(() => {
    const getMaterials = async () => {
      const materials: Array<TMaterial> = [];
      const sessionToken = sessionData?.user.token ?? "";
      for (const material of project.projectMaterial) {
        const materialData = await getMaterial(
          sessionToken,
          material.idMaterial,
        );
        materials.push({
          ...materialData,
          quantity: material.quantity.toString(),
        });
      }
      setCurrentMaterials([...materials]);
    };

    void getMaterials();
  }, []);

  const tagRender: TagRender = (props) => {
    // eslint-disable-next-line react/prop-types
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
        "topRight",
      );
      closeModal();
    } catch (error) {
      openNotification(
        "error",
        "Error al guardar el proyecto",
        "Ha ocurrido un error al cambiar el status del proyecto",
        "topRight",
      );
      console.log("ERROR: ", error);
    }
  };

  return (
    <>
      {notificationElement}
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">{project.name}</h2>
          <Tag color={statusColor}>{status}</Tag>
        </div>
        <div className="space-y-4 p-4">
          <div className="w-full">
            <strong>Descripción:</strong>
            <br />
            <p>{project.description}</p>
          </div>
          <div className="grid w-full grid-cols-2 space-y-4">
            <div className="mt-4">
              <strong>Responsable:</strong> {project.projectManager}
            </div>
            <div>
              <a href={project.projectUri} target="_blank" rel="noreferrer">
                <strong>Ver Archivo</strong>
              </a>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <strong>Materiales:</strong>
            {currentMaterials.map((material, index) => (
              <div
                key={`material-${index}`}
                className="grid w-full grid-cols-2"
              >
                <p>{material.name}</p>
                <p>
                  {material.quantity}
                  {material.measurement.name}
                </p>
              </div>
            ))}
          </div>

          {Roles.External !== role && (
            <div className="flex w-full flex-col gap-1">
              <strong>Cambiar status:</strong>
              <div className="grid w-full grid-cols-2 items-center space-x-4">
                <div className="flex items-center gap-2">
                  <Select
                    tagRender={tagRender}
                    defaultValue={[project.status ?? "I"]}
                    onSelect={(value) => setStatusSelected(value)}
                    style={{ width: "100%" }}
                    options={[
                      {
                        label: "Activo",
                        value: "A",
                      },
                      {
                        label: "Inactivo",
                        value: "I",
                      },
                      {
                        label: "En revisión",
                        value: "R",
                      },
                      {
                        label: "Finalizado",
                        value: "D",
                      },
                    ]}
                  />
                </div>
                <Button onClick={onChangeStatus}>Cambiar</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
