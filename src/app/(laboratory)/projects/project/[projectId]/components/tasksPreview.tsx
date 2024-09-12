import { IProject, TProjectTask } from "@/(laboratory)/projects/interfaces";
import { Button, Card, Descriptions, Modal, Tag } from "antd";
import { getTaskStatus } from "../utils";
import useTaskDetails from "../hooks/useTaskDetails";
import { Roles } from "@/lib/constants";
import { useLabProvider } from "@/context/labProvider";
import TaskDetails from "./taskDetails";

type TTasksPreview = {
  project: IProject;
  tasks: Array<TProjectTask>;
};

export default function TasksPreview({ project, tasks }: TTasksPreview) {
  const { role } = useLabProvider();
  const {
    form,
    openModal,
    currentTask,
    setOpenModal,
    handleSaveTask,
    handleTaskDetails,
  } = useTaskDetails();

  return (
    <>
      <Card title="Tareas" style={{ width: "100%" }}>
        {tasks.map((task) => {
          const taskStatus = getTaskStatus(task.status);
          return (
            <Descriptions key={task.id} labelStyle={{ width: "10%" }} bordered>
              <Descriptions.Item
                label="Nombre"
                contentStyle={{ width: "50%", fontWeight: "bold" }}
              >
                <p
                  className={
                    ["C", "D"].includes(task.status) ? "line-through" : ""
                  }
                >
                  #{task.id} - {task.name}
                </p>
              </Descriptions.Item>
              <Descriptions.Item
                label="Estado"
                contentStyle={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tag color={taskStatus.statusColor}>{taskStatus.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                labelStyle={{ width: "0px", padding: "0px" }}
                contentStyle={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button onClick={() => handleTaskDetails(task)}>
                  Ver tarea
                </Button>
              </Descriptions.Item>
            </Descriptions>
          );
        })}
      </Card>

      <Modal
        centered
        open={openModal}
        onCancel={() => {
          form.resetFields();
          setOpenModal(false);
        }}
        width={600}
        okButtonProps={{
          className: "bg-blue-500",
        }}
        footer={
          Roles.External !== role
            ? [
                <Button
                  key="save"
                  className="border-none bg-blue-500 !text-white hover:!bg-blue-400"
                  onClick={handleSaveTask}
                >
                  Guardar
                </Button>,
              ]
            : []
        }
      >
        <TaskDetails
          project={project}
          currentTask={currentTask}
          formInstance={form}
        />
      </Modal>
    </>
  );
}
