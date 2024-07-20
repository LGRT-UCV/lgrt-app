import { useState } from "react";
import type { FormInstance } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import { getAllMaterials } from "@/(laboratory)/inventory/utils";
import useMaterialInit from "@/(laboratory)/inventory/material/hooks/useMaterialInit";
import type { IProject, TSaveProject } from "../../interfaces";
import { createProject } from "../../utils";
import { Routes } from "@/lib/constants";

export default function useProjectForm(
  formIntance: FormInstance,
  projectData?: IProject,
) {
  const [measurements, setMeasurements] = useState<Array<string>>([]);
  const { openNotification, notificationElement } = useNotification();
  const { materialTypeList, isLoading: isMaterialInitLoading } =
    useMaterialInit(["materialType"]);
  const { data: sessionData } = useSession();
  const router = useRouter();

  const { data: materialList, isLoading: isMaterialLoading } = useQuery({
    queryKey: ["material"],
    queryFn: async () => {
      try {
        const materials = await getAllMaterials(sessionData?.user.token ?? "");
        const materialsToList = [];

        for (const materialType of materialTypeList) {
          const childrenByType = materials.filter(
            (material) => material.materialType.id === materialType.id,
          );
          materialsToList.push({
            value: materialType.id,
            title: materialType.name,
            disabled: true,
            children: childrenByType.map((material) => ({
              value: material.id,
              title: `#${material.id} - ${material.name}`,
            })),
          });
        }
        return {
          materials,
          materialsToList,
        };
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los materiales",
          "",
          "topRight",
        );
        return;
      }
    },
    enabled: !!sessionData?.user.token && materialTypeList.length > 0,
  });

  const onFinish = async (values: TSaveProject) => {
    try {
      const sessionToken = sessionData?.user.token;

      if (typeof sessionToken === "undefined")
        throw new Error("Sesión vencida");

      const projectMaterial = values.projectMaterial?.map((material) => ({
        idMaterial: material.idMaterial,
        quantity: material.quantity.toString(),
      }));

      await createProject(
        {
          ...values,
          projectMaterial,
          file: [],
        },
        sessionToken,
      );

      openNotification(
        "success",
        "Proyecto guardado con exito",
        `El proyecto ${values.name} ha sido creado con exito.`,
        "topRight",
      );
      void router.push(Routes.Inventory);
    } catch (error) {
      openNotification(
        "error",
        "Ha ocurrido un error al guardar el proyecto",
        "",
        "topRight",
      );
      console.log("ERROR: ", error);
    }
  };

  const handleMeasurements = (id: string) => {
    const materialData = materialList?.materials?.find(
      (material) => material.id === id,
    );
    setMeasurements([
      ...measurements,
      materialData?.measurement.description ?? "",
    ]);
  };

  return {
    materialList: materialList?.materialsToList,
    measurements,
    isLoading: isMaterialLoading || isMaterialInitLoading,
    notificationElement,
    onFinish,
    handleMeasurements,
  };
}
