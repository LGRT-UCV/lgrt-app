"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";
import ProjectForm from "./components/projectForm";
import { getProject } from "../utils";
import useNotification from "@/hooks/useNotification";

export default function NewProject () {
  const [form] = useForm();
  const searchParams = useSearchParams();
  const { data: sessionData } = useSession();
  const { openNotification, notificationElement } = useNotification();

  const projectId = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  // const { data: currentProject, isLoading } = useQuery({
  //   queryKey: ["project"],
  //   queryFn: async () => {
  //     try {
  //       if (!projectId) {
  //         form.resetFields();
  //         return;
  //       }

  //       return await getProject(
  //         sessionData?.user.token ?? "",
  //         projectId
  //       );
  //     } catch (error) {
  //       openNotification("error", "Ha ocurrido un error al obtener el material", "", "topRight");
  //       return;
  //     }
  //   },
  //   enabled: !!sessionData?.user.token,
  // });

  // if (isLoading) return (
  //   <div className="w-full text-center pt-4">
  //     <LoadingOutlined className="text-3xl" />
  //   </div>
  // );

  return (
    <>
      <Header
        title={!!projectId ? "Editar proyecto" : "Nuevo proyecto"}
        btn={{
          label: !!projectId ? "Actualizar" : "Guardar",
          icon: <SaveOutlined />,
          type: "primary",
          onClick: form.submit,
        }}
      />

      <div className="h-[calc(100vh-250px)] overflow-y-auto p-4">
        <ProjectForm formIntance={form} />
      </div>
    </>
  );
};