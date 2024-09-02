"use client";

import { SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../../utils";
import useNotification from "@/hooks/useNotification";
import { useSession } from "next-auth/react";
import Details from "../components/projectDetails";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/constants";

export default function ProjectDetails({
  params,
}: {
  params: { projectId: string };
}) {
  const { data: sessionData } = useSession();
  const { openNotification, notificationElement } = useNotification();
  const { projectId } = params;
  const [form] = useForm();
  const router = useRouter();

  const { data: currentProject, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      try {
        if (!projectId) {
          form.resetFields();
          return;
        }

        return await getProject(sessionData?.user.token ?? "", projectId);
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener el proyecto",
          "",
          "topRight",
        );
        return;
      }
    },
    enabled: !!sessionData?.user.token,
  });

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <>
      {notificationElement}
      <Header
        title={currentProject?.name || `Proyecto #${projectId}`}
        btn={{
          label: "Editar",
          icon: <SaveOutlined />,
          type: "primary",
          onClick: () =>
            void router.push(`${Routes.SaveMaterial}?id=${currentProject?.id}`),
        }}
      />

      <div className="h-[calc(100vh-250px)] overflow-y-auto p-4">
        <Details project={currentProject} />
      </div>
    </>
  );
}
