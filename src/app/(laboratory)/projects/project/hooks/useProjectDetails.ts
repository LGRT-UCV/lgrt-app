import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";

import type { IProject, TUpdateProject } from "../../interfaces";
import {
  deleteProject,
  getProjectStatus,
  getProjectStatusStyle,
  updateProject,
} from "../../utils";
import useNotification from "@/hooks/useNotification";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";
import { Routes } from "@/lib/constants";

const { confirm } = Modal;

const destroyAll = () => {
  Modal.destroyAll();
};

type TUseProjectDetails = {
  project?: IProject;
  refetch: () => void;
};

export default function useProjectDetails({
  project,
  refetch,
}: TUseProjectDetails) {
  const [statusSelected, setStatusSelected] = useState<string>();
  const [currentMaterials, setCurrentMaterials] = useState<Array<TMaterial>>(
    [],
  );
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { status, statusColor } = useMemo(() => {
    return getProjectStatusStyle(project?.status ?? "I");
  }, [project?.status]);

  const quantityUsed = useMemo(() => {
    if (typeof project === "undefined") return [];

    const materialUsageMap: { [key: string]: number } = {};
    project.projectTasks.forEach((task) => {
      task.projectTaskMaterials.forEach((material) => {
        if (materialUsageMap[material.idMaterial]) {
          materialUsageMap[material.idMaterial] =
            Number(materialUsageMap[material.idMaterial]) +
            Number(material.usedQuantity);
        } else {
          materialUsageMap[material.idMaterial] = Number(material.usedQuantity);
        }
      });
    });

    return Object.entries(materialUsageMap).map(
      ([idMaterial, quantityUsed]) => ({
        idMaterial,
        quantityUsed,
      }),
    );
  }, []);

  useEffect(() => {
    if (typeof project === "undefined") return;
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

  const onChangeStatus = async () => {
    try {
      const sessionToken = sessionData?.user.token ?? "";
      if (
        typeof project === "undefined" ||
        typeof statusSelected === "undefined" ||
        !sessionToken
      ) {
        throw new Error("No se ha seleccionado un proyecto o un status");
      }

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

  const handleDeleteProject = async () => {
    if (typeof project === "undefined") {
      openNotification(
        "error",
        "No se ha seleccionado un proyecto a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      await deleteProject(sessionData?.user.token ?? "", project.id);
      openNotification(
        "success",
        "Material eliminado",
        `Se ha eliminado el proyecto ${project.name}`,
        "topRight",
      );
      void router.push(Routes.Projects);
    } catch (error) {
      console.error("ERROR: ", error);
      openNotification(
        "error",
        "Ha ocurrido un error al eliminar el proyecto",
        "",
        "topRight",
      );
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "¿Estás seguro que deseas eliminar este proyecto?",
      content: "Esta acción no se puede deshacer",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk() {
        handleDeleteProject();
      },
      onCancel() {
        destroyAll();
      },
    });
  };

  return {
    status,
    statusColor,
    quantityUsed,
    currentMaterials,
    statusSelected,
    notificationElement,
    setStatusSelected,
    onChangeStatus,
    handleDeleteProject,
    showDeleteConfirm,
  };
}
