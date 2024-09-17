import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import type {
  IProjectTask,
  TProjectMaterial,
} from "@/(laboratory)/projects/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";

type TUseTaskForm = {
  openModal: boolean;
  currentTask: string;
  tasks: Array<IProjectTask>;
  materialsProject: Array<TProjectMaterial>;
  projectStatus: string;
};

export default function useTaskForm({
  openModal,
  tasks,
  currentTask,
  materialsProject,
  projectStatus,
}: TUseTaskForm) {
  const [materialsSelected, setMaterialsSelected] = useState<Array<string>>([]);
  const [quantitiesSelected, setQuantitiesSelected] = useState<Array<number>>(
    [],
  );
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (openModal) return;
    setMaterialsSelected([]);
    setQuantitiesSelected([]);
  }, [openModal]);

  useEffect(() => {
    if (typeof currentTask === "undefined") return;
    const taskMaterials = tasks.find(
      (task) => task.id === currentTask,
    )?.projectTaskMaterials;
    if (!taskMaterials) return;
    const materials = taskMaterials.map((material) => material.idMaterial);
    setMaterialsSelected(materials);
    const quantities = taskMaterials.map((material) =>
      Number(material.usedQuantity),
    );
    setQuantitiesSelected(quantities);
  }, [currentTask]);

  const currentTaskData = useMemo(() => {
    return tasks.find((task) => task.id === currentTask);
  }, [currentTask]);

  const materialsUsed = useMemo(() => {
    const materials = tasks.map((task) => {
      return task.projectTaskMaterials;
    });
    return materials.flat();
  }, [currentTaskData]);

  const { data: materialList, isLoading } = useQuery({
    queryKey: ["material"],
    queryFn: async () => {
      try {
        const materialsPromises = materialsProject.map((material) =>
          getMaterial(sessionData?.user.token ?? "", material.idMaterial),
        );
        const materialsResult = await Promise.all(materialsPromises);
        const materialsToList = [];

        for (const material of materialsResult) {
          const materialProject = materialsProject.find(
            (projectMaterial) => projectMaterial.idMaterial === material.id,
          );
          materialsToList.push({
            id: material.id,
            name: material.name,
            materialType: material.materialType.name,
            quantity: material.quantity,
            measurement: material.measurement,
            projectQuantity: materialProject?.quantity ?? 0,
            disabled:
              ["D", "C"].includes(currentTaskData?.status ?? "P") ||
              ["I", "C"].includes(projectStatus),
          });
        }
        return materialsToList;
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener información de los materiales",
          "",
          "topRight",
        );
        return;
      }
    },
    enabled: !!sessionData?.user.token && materialsProject.length > 0,
  });

  const handleMaterialSelected = (idMaterial: string, key: number) => {
    if (key === materialsSelected.length) {
      setQuantitiesSelected([...quantitiesSelected, 0]);
      setMaterialsSelected([...materialsSelected, idMaterial]);
    } else {
      const newMaterialsSelected = materialsSelected.map((material, index) => {
        if (index === key) return idMaterial;
        return material;
      });
      const newQuantitiesSelected = quantitiesSelected.map((value, index) => {
        if (index === key) return 0;
        return value;
      });
      setQuantitiesSelected(newQuantitiesSelected);
      setMaterialsSelected(newMaterialsSelected);
    }
  };

  const handleQuantitySelected = (quantity: number, key: number) => {
    const newQuantitiesSelected = quantitiesSelected.map((value, index) => {
      if (index === key) return quantity;
      return value;
    });
    setQuantitiesSelected(newQuantitiesSelected);
  };

  const handleRemoveMaterial = (key: number) => {
    const newMaterialsSelected = materialsSelected.filter(
      (_, index) => index !== key,
    );
    const newQuantitiesSelected = quantitiesSelected.filter(
      (_, index) => index !== key,
    );
    setQuantitiesSelected(newQuantitiesSelected);
    setMaterialsSelected(newMaterialsSelected);
  };

  return {
    materialsSelected,
    quantitiesSelected,
    materialList,
    materialsUsed,
    isLoading,
    currentTaskData,
    handleMaterialSelected,
    handleQuantitySelected,
    handleRemoveMaterial,
    notificationElement,
  };
}
