import { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import { getAllMaterials } from "@/(laboratory)/inventory/utils";
import useMaterialInit from "@/(laboratory)/inventory/material/hooks/useMaterialInit";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import type { IProject, TSaveProject } from "../../interfaces";
import { createProject, updateProject } from "../../utils";
import { Routes } from "@/lib/constants";

export default function useProjectForm(
  formIntance: FormInstance,
  projectData?: IProject,
) {
  const [measurements, setMeasurements] = useState<Array<string>>([]);
  const [materialsSelected, setMaterialsSelected] = useState<Array<TMaterial>>(
    [],
  );
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

  useEffect(() => {
    if (
      typeof projectData === "undefined" ||
      typeof materialList === "undefined"
    )
      return;

    projectData.projectMaterial?.forEach((material, index) => {
      handleMeasurements(material.idMaterial, index);
    });
  }, [projectData, materialList]);

  useEffect(() => {
    if (typeof projectData === "undefined") {
      formIntance.resetFields();
    }
  }, []);

  const onFinish = async (values: TSaveProject) => {
    try {
      const sessionToken = sessionData?.user.token;

      if (typeof sessionToken === "undefined")
        throw new Error("Sesión vencida");

      const projectMaterial = values.projectMaterial?.map((material) => ({
        idMaterial: material.idMaterial,
        quantity: material.quantity.toString(),
      }));
      const project = {
        ...values,
        projectMaterial,
        file: [],
      };

      if (projectData) {
        await updateProject(
          projectData.id,
          {
            name: project.name,
            description: project.description,
            projectManager: project.projectManager,
            projectUri: project.projectUri,
            projectMaterial: project.projectMaterial,
          },
          sessionToken,
        );
      } else {
        await createProject(project, sessionToken);
      }

      openNotification(
        "success",
        "Proyecto guardado con éxito",
        `El proyecto ${values.name} ha sido creado con éxito.`,
        "topRight",
      );
      formIntance.resetFields();
      void router.push(Routes.Projects);
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

  const handleMeasurements = (id: string, key: number) => {
    const materialData = materialList?.materials?.find(
      (material) => material.id === id,
    );
    if (materialData === undefined) return;

    setMaterialsSelected((prev) => {
      if (key >= prev.length) {
        return [...prev, materialData];
      }
      const materials = prev.map((material, index) =>
        index === key ? materialData : material,
      );
      return materials;
    });

    const newMeasurement = materialData.measurement.description;
    setMeasurements((prev) => {
      if (key >= prev.length) {
        return [...prev, newMeasurement];
      }
      const updateMeasurements = prev.map((measurement, index) =>
        index === key ? newMeasurement : measurement,
      );
      return updateMeasurements;
    });
  };

  const handleRemoveMaterial = (key: number) => {
    setMaterialsSelected((prev) => {
      const materials = prev.filter((_, index) => index !== key);
      return materials;
    });

    setMeasurements((prev) => {
      const measurements = prev.filter((_, index) => index !== key);
      return measurements;
    });
  };

  return {
    materialList: materialList?.materialsToList,
    measurements,
    materialsSelected,
    isLoading: isMaterialLoading || isMaterialInitLoading,
    notificationElement,
    onFinish,
    handleMeasurements,
    handleRemoveMaterial,
  };
}
