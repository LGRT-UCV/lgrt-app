"use client";

import { SaveOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";
import MaterialForm from "./components/materialForm";

export default function NewMaterial () {
  const [form] = useForm();

  return (
    <>
      <Header
        title="Nuevo elemento"
        btn={{
          label: "Guardar",
          icon: <SaveOutlined />,
          onClick: form.submit
        }}
      />

      <div className="h-[calc(100vh-250px)] overflow-y-auto p-4">
        <MaterialForm formIntance={form} />
      </div>
    </>
  );
};