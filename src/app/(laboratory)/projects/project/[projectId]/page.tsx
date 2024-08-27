"use client";

import { SaveOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";

export default function ProjectDetails({
  params,
}: {
  params: { projectId: string };
}) {
  const [form] = useForm();

  console.log("projectId", params);

  return (
    <>
      <Header
        title={params.projectId}
        btn={{
          label: "Editar",
          icon: <SaveOutlined />,
          type: "primary",
          onClick: form.submit,
        }}
      />

      <div className="h-[calc(100vh-250px)] overflow-y-auto p-4">Data</div>
    </>
  );
}
