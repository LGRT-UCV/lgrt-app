"use client";

import { useSession } from "next-auth/react";
import { Card, Descriptions } from "antd";
import { getUserRole } from "../admin/users/utils";
import ResetPassword from "./components/resetPassword";

export default function Profile () {
  const { data: sessionData } = useSession();

  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 24, maxHeight: "90vh", overflow: "auto"}}>
      <Card title="Información del usuario" style={{ width: "100%" }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item key={"name"} label="Nombre">{sessionData?.user.user.name}</Descriptions.Item>
          <Descriptions.Item key={"lastname"} label="Apellido">{sessionData?.user.user.lastName}</Descriptions.Item>
          <Descriptions.Item key={"id"} label="Cédula">{sessionData?.user.user.identificationNumber}</Descriptions.Item>
          <Descriptions.Item key={"email"} label="Correo">{sessionData?.user.user.id}</Descriptions.Item>
          <Descriptions.Item key={"role"} label="Tipo de usuario">{getUserRole(Number(sessionData?.user.user.idRoleId ?? 3))}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Información del laboratorio" style={{ width: "100%" }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item key={"labName"} label="Nombre del laboratorio">{sessionData?.user.user.laboratory.name}</Descriptions.Item>
          <Descriptions.Item key={"labDescription"} label="Descripción del laboratorio">{sessionData?.user.user.laboratory.description}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Gestión de clave" style={{ width: "100%" }} >
        <ResetPassword />
      </Card>
    </div>
  );
};
