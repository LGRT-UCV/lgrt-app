import React, { useMemo } from "react";
import { IProject, TProjectTask } from "@/(laboratory)/projects/interfaces";
import { Button, Card, Descriptions, Modal, Progress, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getTaskStatus } from "../utils";
import useTaskDetails from "../hooks/useTaskDetails";
import { Roles } from "@/lib/constants";
import { useLabProvider } from "@/context/labProvider";
import TaskDetails from "./taskDetails";
import { isDesktop } from "react-device-detect";

type TTasksPreview = {
  project: IProject;
  tasks: Array<TProjectTask>;
  refetch: () => void;
};

export default function TasksPreview({
  project,
  tasks,
  refetch,
}: TTasksPreview) {
  const { role } = useLabProvider();
  const {
    form,
    openModal,
    currentTask,
    setOpenModal,
    handleSaveTask,
    handleCreateTask,
    handleTaskDetails,
  } = useTaskDetails();

  const { completedPercentage, successPercentage } = useMemo(() => {
    if (tasks.length === 0)
      return {
        completedPercentage: 0,
        successPercentage: 0,
      };

    const totalTasks = tasks.length;
    const tasksCompleted = tasks.filter((task) =>
      ["C", "D"].includes(task.status ?? "P"),
    ).length;
    const tasksProgress = tasks.filter((task) => "E" === task.status).length;

    return {
      completedPercentage:
        parseFloat(Number(tasksCompleted / totalTasks).toFixed(2)) * 100,
      successPercentage:
        parseFloat(
          Number((tasksProgress + tasksCompleted) / totalTasks).toFixed(2),
        ) * 100,
    };
  }, [tasks]);

  return (
    <>
      <Card title="Tareas" style={{ width: "100%" }}>
        <Progress
          percent={successPercentage}
          strokeColor="orange"
          success={{ percent: completedPercentage }}
          size={["100%", 20]}
          className="mb-4"
        />
        {tasks.map((task) => {
          const taskStatus = getTaskStatus(task?.status ?? "P");
          return (
            <Descriptions key={task.id} labelStyle={{ width: "10%" }} bordered>
              <Descriptions.Item
                labelStyle={{ width: "0px", padding: "0px", display: "none" }}
                contentStyle={{ width: "50%", fontWeight: "bold" }}
              >
                <p
                  className={
                    ["C", "D"].includes(task?.status ?? "P")
                      ? "line-through"
                      : ""
                  }
                >
                  #{task.id} - {task.name}
                </p>
              </Descriptions.Item>
              {!isDesktop && (
                <Descriptions.Item
                  labelStyle={{ width: "0px", padding: "0px", display: "none" }}
                  contentStyle={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Tag color={taskStatus.statusColor}>{taskStatus.status}</Tag>
                </Descriptions.Item>
              )}
              {isDesktop && (
                <Descriptions.Item
                  labelStyle={{ width: "0px", padding: "0px" }}
                  contentStyle={{
                    width: "15%",
                  }}
                >
                  <Tag color={taskStatus.statusColor}>{taskStatus.status}</Tag>
                </Descriptions.Item>
              )}
              <Descriptions.Item
                labelStyle={{ width: "0px", padding: "0px", display: "none" }}
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

        <Button
          type="dashed"
          onClick={handleCreateTask}
          block
          size="large"
          icon={<PlusOutlined />}
          className="mt-4"
          disabled={!["A"].includes(project.status)}
        >
          Crear tarea
        </Button>
      </Card>

      <Modal
        title={typeof currentTask === "undefined" ? "Crear tarea" : undefined}
        centered
        open={openModal}
        onCancel={() => {
          form.resetFields();
          setOpenModal(false);
        }}
        width={800}
        okButtonProps={{
          className: "bg-blue-500",
        }}
        footer={
          Roles.External !== role
            ? [
                <Button
                  key="save"
                  className="border-none !bg-blue-500 !text-white hover:!bg-blue-400"
                  onClick={handleSaveTask}
                  disabled={!["A"].includes(project.status)}
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
          openModal={openModal}
          refetch={refetch}
        />
      </Modal>
    </>
  );
}
