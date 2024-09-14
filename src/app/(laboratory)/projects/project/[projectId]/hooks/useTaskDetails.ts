import { TProjectTask } from "@/(laboratory)/projects/interfaces";
import { Form } from "antd";
import { useState } from "react";

export default function useTaskDetails() {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<TProjectTask>();

  const handleTaskDetails = (task: TProjectTask) => {
    setCurrentTask(task);
    form.setFieldsValue({
      status: task.status,
      name: task.name,
      description: task.description,
      projectTaskMaterials: task.projectTaskMaterials,
    });
    setOpenModal(true);
  };

  const handleCreateTask = () => {
    setCurrentTask(undefined);
    form.resetFields();
    setOpenModal(true);
  };

  const handleSaveTask = () => {
    form
      .validateFields()
      .then(() => {
        form.submit();
        setOpenModal(false);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  return {
    form,
    currentTask,
    openModal,
    setCurrentTask,
    setOpenModal,
    handleTaskDetails,
    handleCreateTask,
    handleSaveTask,
  };
}
