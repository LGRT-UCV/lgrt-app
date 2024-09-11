import { ITaskDetails } from "@/(laboratory)/projects/interfaces";
import { useState } from "react";

type TUseTaskDetails = {
  projectId: string;
};

export default function useTaskDetails({ projectId }: TUseTaskDetails) {
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITaskDetails>();

  const handleTaskDetails = () => {
    console.log("handleTaskDetails", projectId);
    setOpenModal(true);
  };

  const handleSaveTask = (task?: ITaskDetails) => {
    console.log("task", task);
    setOpenModal(false);
  };

  return {
    currentTask,
    openModal,
    setCurrentTask,
    setOpenModal,
    handleTaskDetails,
    handleSaveTask,
  };
}
