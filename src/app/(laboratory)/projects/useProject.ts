import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteProject, getAllProjects } from "./utils";
import type { IProject } from "./interfaces";

export default function useProject () {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<IProject>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const { data: projectList= [], isLoading, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        return await getAllProjects(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los materiales",
          "",
          "topRight"
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleDeleteProject = async (project?: IProject) => {
    if (typeof project === "undefined") {
      openNotification("error", "No se ha seleccionado material a eliminar", "", "topRight");
      return;
    }
  
    try {
      await deleteProject(
        sessionData?.user.token ?? "",
        project.id
      );
      void refetch();
      setCurrentProject(undefined);
      setOpenModal(false);
      openNotification(
        "success",
        "Material eliminado",
        `Se ha eliminado el material ${project.name}`,
        "topRight"
      );
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al eliminar el material", "", "topRight");
    }
  };

  const handleProjectDetails = (project?: IProject, show = true) => {
    setCurrentProject(project)
    setOpenModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    return projectList.map((project, index) => ({
      ...project,
      key: `project-${index}`,
      description: project.description.substring(0, 120) + "...",
    })) ?? [];
  }, [projectList, searchValue]);

  return {
    openModal,
    tableData,
    currentProject,
    projectList,
    isLoading,
    notificationElement,
    handleDeleteProject,
    handleProjectDetails,
    setOpenModal,
    setSearchValue,
  };
};