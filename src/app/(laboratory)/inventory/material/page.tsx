"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import Header from "@/components/layout/header";
import MaterialForm from "./components/materialForm";
import { getMaterial } from "../utils";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import { useLabProvider } from "@/context/labProvider";
import { Roles, Routes } from "@/lib/constants";

export default function NewMaterial() {
  const { role } = useLabProvider();
  const [form] = useForm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { openNotification, notificationElement } = useNotification();

  useEffect(() => {
    if (![Roles.Admin, Roles.Personal, Roles.PersonalExtra].includes(role)) {
      router.push(Routes.Inventory);
    }
  }, [role]);

  const materialId = useMemo(() => {
    return searchParams.get("id");
  }, [searchParams]);

  useEffect(() => {
    if (!materialId) {
      form.resetFields();
    }
  }, [materialId]);

  const { data: currentMaterial, isLoading } = useQuery({
    queryKey: ["material"],
    queryFn: async () => {
      try {
        if (!materialId) {
          return;
        }

        return await getMaterial(sessionData?.user.token ?? "", materialId);
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener el material",
          "",
          "topRight",
        );
        return;
      }
    },
    enabled: !!sessionData?.user.token || !!materialId,
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
        title={!!materialId ? "Editar material" : "Nuevo material"}
        btn={{
          label: !!materialId ? "Actualizar" : "Guardar",
          icon: <SaveOutlined />,
          type: "primary",
          onClick: form.submit,
        }}
      />

      <div className="h-[calc(100vh-190px)] overflow-y-auto p-4">
        <MaterialForm formIntance={form} materialData={currentMaterial} />
      </div>
    </>
  );
}
