import React from "react";
import { Button, Card, Descriptions, Select, Tag } from "antd";
import type { IProject } from "../../interfaces";
import { SelectProps } from "antd/lib";
import { ExportOutlined } from "@ant-design/icons";
import { projectStatus } from "../../utils";
import { Roles } from "@/lib/constants";
import { useLabProvider } from "@/context/labProvider";
import TasksPreview from "../[projectId]/components/tasksPreview";
import useProjectDetails from "../hooks/useProjectDetails";
import { isDesktop } from "react-device-detect";

type TagRender = SelectProps["tagRender"];

interface IProjectDetails {
  project?: IProject;
  refetch: () => void;
}

export default function ProjectDetails({ project, refetch }: IProjectDetails) {
  const { role } = useLabProvider();
  const {
    notificationElement,
    currentMaterials,
    quantityUsed,
    status,
    statusColor,
    setStatusSelected,
    onChangeStatus,
    showDeleteConfirm,
  } = useProjectDetails({ project, refetch });

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

  if (typeof project === "undefined") return <></>;

  return (
    <>
      {notificationElement}
      <div className="flex flex-col gap-6">
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
              <Descriptions.Item key={"url"} label="URL">
                <a
                  className="flex gap-2"
                  href={project.projectUri}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>Abrir URL</strong>
                  <ExportOutlined />
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
        <Card title="Materiales a usar" style={{ width: "100%" }}>
          {currentMaterials.map((material) => {
            const materialUsed = quantityUsed.find(
              (used) => material.id === used.idMaterial,
            );
            return (
              <Descriptions
                key={`material-${material.id}`}
                bordered
                column={isDesktop ? 2 : 1}
                labelStyle={{ width: "15%" }}
                contentStyle={{ width: "30%" }}
                style={{ marginBottom: 16 }}
              >
                <Descriptions.Item key="quantity" label="Material">
                  {material.name}
                </Descriptions.Item>
                <Descriptions.Item key="quantity" label="Cantidad">
                  <span
                    className={
                      Number(materialUsed?.quantityUsed ?? 0) >
                      Number(material.quantity)
                        ? "text-orange-500"
                        : ""
                    }
                  >
                    {materialUsed?.quantityUsed ?? 0}
                    {Number(material.materialType.id) !== 2
                      ? material.measurement.name
                      : ""}
                    {" usado / "}
                  </span>
                  <span>
                    {material.quantity}
                    {`${Number(material.materialType.id) !== 2 ? material.measurement.name : ""} `}
                    {" estimado"}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            );
          })}
        </Card>
        {Roles.External !== role && (
          <Card title="Acciones" style={{ width: "100%" }}>
            <Descriptions bordered column={1} labelStyle={{ width: "30%" }}>
              <Descriptions.Item key="status" label="Cambiar Estado">
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
              </Descriptions.Item>
              <Descriptions.Item
                key="delete"
                label="Eliminar proyecto"
                contentStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  key="save"
                  className="border-none !bg-red-500 !text-white hover:!bg-red-400"
                  onClick={showDeleteConfirm}
                  disabled={
                    ["D", "R"].includes(project.status) ||
                    project.projectTasks.some((task) => task.status === "D")
                  }
                >
                  Eliminar proyecto
                </Button>
              </Descriptions.Item>
            </Descriptions>
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
