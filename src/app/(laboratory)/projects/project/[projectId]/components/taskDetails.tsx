import { useMemo } from "react";
import { Form, FormInstance, Input, Select, Tag } from "antd";
import {
  ETaskStatus,
  type TTaskStatus,
  type TProjectTask,
  ISaveProjectTask,
  IProject,
} from "@/(laboratory)/projects/interfaces";
import useNotification from "@/hooks/useNotification";
import { getTaskStatus, updateProjectTask } from "../utils";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import ProjectMaterials from "../../components/projectMaterials";

type TTaskDetails = {
  formInstance: FormInstance;
  project: IProject;
  currentTask?: TProjectTask;
};

export default function TaskDetails({
  formInstance,
  project,
  currentTask,
}: TTaskDetails) {
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  console.log("project: ", project);

  const { status, statusColor } = useMemo(() => {
    if (!currentTask) return { status: "P", statusColor: "gray" };
    return getTaskStatus(currentTask.status);
  }, [currentTask?.status]);

  const onFinish = async (taskData: ISaveProjectTask) => {
    if (typeof currentTask === "undefined") return;
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      await updateProjectTask(currentTask.id, project.id, taskData, user.token);

      openNotification(
        "success",
        "Tarea guardada con exito",
        `La tarea ${taskData.name} ha sido guardada con exito.`,
        "topRight",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("ERROR: ", error);

      openNotification(
        "error",
        "Ha ocurrido un error al guardar la tarea",
        "",
        "topRight",
      );
    }
  };

  return (
    <>
      {notificationElement}
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">#{currentTask?.id}</h2>
          <Tag color={statusColor}>{status}</Tag>
        </div>
        <Form
          name="taskForm"
          form={formInstance}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
          className="p-4"
        >
          <Form.Item
            name="status"
            rules={[{ required: true, message: "Por favor elija una opción" }]}
            className="mb-4 w-full px-2 md:w-1/3"
          >
            <Select
              placeholder="Estado"
              onSelect={() => formInstance.submit()}
              options={Object.keys(ETaskStatus).map((taskStatus) => {
                const statusToList = getTaskStatus(taskStatus as TTaskStatus);
                return {
                  label: statusToList.status,
                  value: taskStatus,
                };
              })}
            />
          </Form.Item>
          <Form.Item
            name="name"
            className="mb-4 w-full px-2"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el nombre de la tarea",
              },
            ]}
          >
            <Input placeholder="Nombre de la tarea" maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Descripción"
            name="description"
            className="w-full px-2"
            rules={[
              {
                type: "string",
                required: false,
                max: 500,
                message: "Por favor verifique la descripción de la tarea",
              },
            ]}
          >
            <TextArea
              placeholder="Descripción de la tarea..."
              rows={4}
              maxLength={500}
            />
          </Form.Item>

          {/* <ProjectMaterials

          /> */}
        </Form>
      </div>
    </>
  );
}