import useNotification from "@/hooks/useNotification";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "antd/es/form/Form";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getProject } from "../../utils";

export default function useProject() {
  const { data: sessionData } = useSession();
  const { notificationElement, openNotification } = useNotification();
  const [form] = useForm();
  const searchParams = useSearchParams();

  const projectId = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  const { data: currentProject, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      try {
        if (!projectId) return;

        return await getProject(sessionData?.user.token ?? "", projectId);
      } catch (error) {
        console.error(error);
        openNotification(
          "error",
          "Ha ocurrido un error al obtener el material",
          "",
          "topRight",
        );
        return;
      }
    },
    enabled: !!sessionData?.user.token && !!projectId,
  });

  useEffect(() => {
    if ([typeof projectId, typeof currentProject].includes("undefined")) return;
    form.setFieldsValue({
      name: currentProject?.name,
      projectManager: currentProject?.projectManager,
      description: currentProject?.description,
      projectUri: currentProject?.projectUri,
      projectMaterial: currentProject?.projectMaterial.map((material) => ({
        ...material,
        quantity: Number(material.quantity),
      })),
    });
  }, [currentProject]);

  return {
    form,
    projectId,
    currentProject,
    isLoading,
    notificationElement,
    openNotification,
  };
}
