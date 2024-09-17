"use client";

import { SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import Header from "@/components/layout/header";
import ProjectForm from "./components/projectForm";
import useProject from "./hooks/useProject";

export default function NewProject() {
  const { form, projectId, currentProject, isLoading, notificationElement } =
    useProject();

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
        title={!!projectId ? "Editar proyecto" : "Nuevo proyecto"}
        btn={{
          label: !!projectId ? "Actualizar" : "Guardar",
          icon: <SaveOutlined />,
          type: "primary",
          onClick: form.submit,
        }}
      />

      <div className="h-[calc(100vh-200px)] overflow-y-auto p-4">
        <ProjectForm formIntance={form} projectData={currentProject} />
      </div>
    </>
  );
}
