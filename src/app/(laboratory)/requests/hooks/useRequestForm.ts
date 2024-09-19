import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import { getAllMaterials } from "@/(laboratory)/inventory/utils";
import useMaterialInit from "@/(laboratory)/inventory/material/hooks/useMaterialInit";
import type { TSaveRequest } from "../interfaces";
import { createRequest } from "../utils";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";

export default function useRequestForm(callback: () => void) {
  const [measurements, setMeasurements] = useState<Array<string>>([]);
  const [materialsSelected, setMaterialsSelected] = useState<Array<TMaterial>>(
    [],
  );
  const { openNotification, notificationElement } = useNotification();
  const { materialTypeList, isLoading: isMaterialInitLoading } =
    useMaterialInit(["materialType"]);
  const { data: sessionData } = useSession();

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

  const onFinish = async (values: TSaveRequest) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      const materialRequestMaterial = values.materialRequestMaterial?.map(
        (material) => ({
          idMaterial: material.idMaterial,
          quantity: material.quantity.toString(),
        }),
      );

      await createRequest(
        {
          ...values,
          materialRequestMaterial,
        },
        user.token,
      );

      openNotification(
        "success",
        "Solicitud guardada con éxito",
        `La solicitud ha sido creada con éxito.`,
        "topRight",
      );
      callback();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        String(error.details).includes(
          "The quantity of a material cannot be greater than",
        )
      ) {
        openNotification(
          "error",
          "No hay cantidad suficiente",
          "La cantidad de material no puede ser mayor a la cantidad en inventario",
          "topRight",
        );
      }
      openNotification(
        "error",
        "Ha ocurrido un error al guardar la solicitud",
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

  const resetValues = () => {
    setMaterialsSelected([]);
    setMeasurements([]);
  };

  return {
    materialList: materialList?.materialsToList,
    materialsSelected,
    measurements,
    isLoading: isMaterialLoading || isMaterialInitLoading,
    notificationElement,
    onFinish,
    handleMeasurements,
    handleRemoveMaterial,
    resetValues,
  };
}
