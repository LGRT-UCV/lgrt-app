import type { FormInstance } from "antd";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import { getAllMaterials } from "@/(laboratory)/inventory/utils";
import useMaterialInit from "@/(laboratory)/inventory/material/hooks/useMaterialInit";
import type { IProject } from "../../interfaces";

export default function useProjectForm (formIntance: FormInstance, projectData?: IProject) {
  const { openNotification, notificationElement } = useNotification();
  const { materialTypeList, isLoading: isMaterialInitLoading } = useMaterialInit(["materialType"]);
  const { data: sessionData } = useSession();

  const { data: materialList = [], isLoading: isMaterialLoading } = useQuery({
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
            children: childrenByType.map(material => ({
              value: material.id,
              title: `#${material.id} - ${material.name}`,
            })),
          });
        }
        return materialsToList;
      } catch (error) {
        openNotification("error", "Ha ocurrido un error al obtener los materiales", "", "topRight");
        return [];
      }
    },
    enabled: !!sessionData?.user.token && materialTypeList.length > 0,
  });

  return {
    materialList,
    isLoading: isMaterialLoading || isMaterialInitLoading,
    notificationElement,
  };
};