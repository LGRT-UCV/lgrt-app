import { TProjectTask } from "@/(laboratory)/projects/interfaces";
import { Form } from "antd";
import { useState } from "react";

// type TUseTaskDetails = {
//   projectId: string;
// };

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
    });
    setOpenModal(true);
  };

  const handleSaveTask = () => {
    form.submit();
  };

  return {
    form,
    currentTask,
    openModal,
    setCurrentTask,
    setOpenModal,
    handleTaskDetails,
    handleSaveTask,
  };
}
