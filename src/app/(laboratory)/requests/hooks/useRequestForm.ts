import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import { getAllMaterials } from "@/(laboratory)/inventory/utils";
import useMaterialInit from "@/(laboratory)/inventory/material/hooks/useMaterialInit";
import type { TSaveRequest } from "../interfaces";
import { createRequest } from "../utils";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";

export default function useRequestForm (callback: () => void) {
  const [measurements, setMeasurements] = useState<Array<string>>([]);
  const [materialsSelected, setMaterialsSelected] = useState<Array<TMaterial>>([]);
  const { openNotification, notificationElement } = useNotification();
  const { materialTypeList, isLoading: isMaterialInitLoading } = useMaterialInit(["materialType"]);
  const { data: sessionData } = useSession();

  const { data: materialList, isLoading: isMaterialLoading } = useQuery({
    queryKey: ["material"],
    queryFn: async () => {
      try {
        const materials = await getAllMaterials(sessionData?.user.token ?? "");
        const materialsToList = [];
        
        for (const materialType of materialTypeList) {
          const childrenByType = materials.filter(material => material.materialType.id === materialType.id);
          materialsToList.push({
            value: materialType.id,
            title: materialType.name,
            disabled: true,
            children: childrenByType.map(material => ({
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
        openNotification("error", "Ha ocurrido un error al obtener los materiales", "", "topRight");
        return;
      }
    },
    enabled: !!sessionData?.user.token && materialTypeList.length > 0,
  });

  const onFinish = async (values: TSaveRequest) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      const materialRequestMaterial = values.materialRequestMaterial?.map(material => ({
        idMaterial: material.idMaterial,
        quantity: material.quantity.toString(),
      }));

      await createRequest({
        ...values,
        materialRequestMaterial,
      } , user.token);

      openNotification(
        "success",
        "Solicitud guardada con exito",
        `La solicitud ha sido creada con exito.`,
        "topRight"
      );
      callback();
    } catch (error: any) {
      if (String(error.details).includes("The quantity of a material cannot be greater than")) {
        openNotification(
          "error",
          "No hay cantidad suficiente", "La cantidad de material no puede ser mayor a la cantidad en inventario", "topRight");
      }
      openNotification("error", "Ha ocurrido un error al guardar la solicitud", "", "topRight");
      console.log("ERROR: ", error);
    }
  };

  const handleMeasurements = (id: string) => {
    const materialData = materialList?.materials?.find((material) => material.id === id);
    if (materialData === undefined) return;

    setMaterialsSelected([...materialsSelected, materialData]);
    setMeasurements([...measurements, materialData?.measurement.description ?? ""]);
  };

  return {
    materialList: materialList?.materialsToList,
    materialsSelected,
    measurements,
    isLoading: isMaterialLoading || isMaterialInitLoading,
    notificationElement,
    onFinish,
    handleMeasurements,
  };
};