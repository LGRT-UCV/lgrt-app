import { Button, Card, Descriptions, Select, Tag } from "antd";
import type { IProject, TUpdateProject } from "../../interfaces";
import { useEffect, useMemo, useState } from "react";
import { SelectProps } from "antd/lib";
import {
  getProjectStatus,
  getProjectStatusStyle,
  projectStatus,
  updateProject,
} from "../../utils";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";
import { Roles } from "@/lib/constants";
import { useLabProvider } from "@/context/labProvider";
import TasksPreview from "../[projectId]/components/tasksPreview";

type TagRender = SelectProps["tagRender"];

interface IProjectDetails {
  project?: IProject;
  closeModal?: () => void;
  refetch: () => void;
}

export default function ProjectDetails({
  project,
  closeModal,
  refetch,
}: IProjectDetails) {
  const { role } = useLabProvider();
  const [statusSelected, setStatusSelected] = useState<string>();
  const [currentMaterials, setCurrentMaterials] = useState<Array<TMaterial>>(
    [],
  );
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  if (typeof project === "undefined") return <></>;

  const { status, statusColor } = useMemo(() => {
    return getProjectStatusStyle(project.status);
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
        `El status ${getProjectStatus(statusSelected ?? "I").label.toLowerCase()} ha sido guardado con exito.`,
        "topRight",
      );
      refetch();
      closeModal?.();
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
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Card title="Información del proyecto" style={{ width: "100%" }}>
          <Descriptions bordered column={1} labelStyle={{ width: "15%" }}>
            <Descriptions.Item key={"id"} label="ID">
              #{project.id}
            </Descriptions.Item>
            <Descriptions.Item key={"status"} label="Estado">
              <Tag color={statusColor}>{status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item key={"name"} label="Nombre">
              {project.name}
            </Descriptions.Item>
            <Descriptions.Item key={"description"} label="Descripción">
              {project.description}
            </Descriptions.Item>
            <Descriptions.Item key={"projectManager"} label="Responsable">
              {project.projectManager}
            </Descriptions.Item>
            {project.projectUri && (
              <Descriptions.Item key={"projectManager"} label="Responsable">
                <a href={project.projectUri} target="_blank" rel="noreferrer">
                  <strong>Ver Archivo</strong>
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
        <Card title="Materiales a usar" style={{ width: "100%" }}>
          {currentMaterials.map((material) => (
            <Descriptions
              key={`material-${material.id}`}
              bordered
              column={2}
              labelStyle={{ width: "15%" }}
              contentStyle={{ width: "30%" }}
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item key="quantity" label="Material">
                {material.name}
              </Descriptions.Item>
              <Descriptions.Item key="quantity" label="Cantidad">
                {material.quantity}
                {material.measurement.name}
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Card>
        {Roles.External !== role && (
          <Card title="Cambiar Estado" style={{ width: "100%" }}>
            <div className="flex items-center justify-center gap-4">
              <Select
                tagRender={tagRender}
                defaultValue={[project.status ?? "I"]}
                onSelect={(value) => setStatusSelected(value)}
                className="w-full md:w-1/3"
                options={projectStatus}
              />
              <Button onClick={onChangeStatus}>Cambiar</Button>
            </div>
          </Card>
        )}
        {Roles.External !== role && (
          <TasksPreview
            tasks={project.projectTasks}
            project={project}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
}
