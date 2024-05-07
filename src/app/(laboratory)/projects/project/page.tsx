"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SaveOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";
import ProjectForm from "./components/projectForm";
import type { IProject } from "../interfaces";
import { getProject } from "../utils";

export default function NewProject () {
  const [form] = useForm();
  const [currentProject, setCurrentProject] = useState<IProject>();
  const searchParams = useSearchParams();
  const { data: sessionData } = useSession();

  const projectId = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  useEffect(() => {
    if (!projectId) {
      form.resetFields();
      return;
    }
    
    const getProjectData = async () => {
      const projectResponse = await getProject(
        sessionData?.user.token ?? "",
        projectId
      );
      setCurrentProject(projectResponse);
    };

    void getProjectData();
  }, [projectId]);

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
        <ProjectForm formIntance={form} projectData={currentProject} />
      </div>
    </>
  );
};