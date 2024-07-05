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
          "Ha ocurrido un error al obtener los proyectos",
          "",
          "topRight"
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateProject = () => {
    setOpenModal(false);
    void refetch();
  };

  const handleDeleteProject = async (project?: IProject) => {
    if (typeof project === "undefined") {
      openNotification("error", "No se ha seleccionado un projecto a eliminar", "", "topRight");
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
        `Se ha eliminado el proyecto ${project.name}`,
        "topRight"
      );
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al eliminar el projecto", "", "topRight");
    }
  };

  const handleProjectDetails = (project?: IProject, show = true) => {
    setCurrentProject(project)
    setOpenModal(show);
  };

  const handleRequestMaterials = (project?: IProject) => {
    
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    const search = searchValue.toLocaleLowerCase();
    const projects = projectList.filter((project) =>
      project.name.toLocaleLowerCase().includes(search) ||
      project.description.toLocaleLowerCase().includes(search)
    );
    return projects.map((project, index) => ({
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
    handleUpdateProject,
    handleRequestMaterials,
  };
};