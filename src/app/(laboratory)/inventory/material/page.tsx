"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { SaveOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";
import MaterialForm from "./components/materialForm";
import { getMaterial } from "../utils";
import type { TMaterial } from "../interfaces";

export default function NewMaterial () {
  const [form] = useForm();
  const [currentMaterial, setCurrentMaterial] = useState<TMaterial>();
  const searchParams = useSearchParams();
  const { data: sessionData } = useSession();

  const materialId = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  useEffect(() => {
    if (!materialId) return;
    
    const getMaterialData = async () => {
      const materialResponse = await getMaterial(
        sessionData?.user.token ?? "",
        materialId
      );
      setCurrentMaterial(materialResponse);
    };

    void getMaterialData();
  }, [materialId]);

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
        <MaterialForm formIntance={form} materialData={currentMaterial} />
      </div>
    </>
  );
};