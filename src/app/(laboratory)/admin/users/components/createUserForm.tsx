import { useSession } from "next-auth/react";
import { Form, Input, InputNumber, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { getUserRoleName, userRoles } from "../utils";
import { TNotificationType } from "@/types/app";
import { useQuery } from "@tanstack/react-query";
import { getAllLaboratories } from "../../laboratory/utils";
import type { FormInstance } from "antd/lib";
import type { NotificationPlacement } from "antd/es/notification/interface";
import RequiredLegend from "@/components/feedback/requiredLegend";
import { IUser } from "../interfaces";

type TCreateUserForm = {
  form: FormInstance;
  isLoading?: boolean;
  data?: IUser;
  openNotification: (
    type: TNotificationType,
    message: string,
    description: string,
    placement: NotificationPlacement,
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish: (values: any) => void;
};

export default function CreateUserForm({
  form,
  data,
  isLoading,
  openNotification,
  onFinish,
}: TCreateUserForm) {
  const { data: sessionData } = useSession();
  const { data: laboratoryList = [], isLoading: isLabLoading } = useQuery({
    queryKey: ["laboratory"],
    queryFn: async () => {
      try {
        const laboratories = await getAllLaboratories(
          sessionData?.user.token ?? "",
        );

        return laboratories;
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los laboratorios",
          "",
          "topRight",
        );
        return;
      }
    },
    enabled: !!sessionData?.user.token,
  });

  if (isLoading || isLabLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <Form
      name="userForm"
      form={form}
      onFinish={onFinish}
      layout="vertical"
      size="large"
      scrollToFirstError
      className="p-4"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <Form.Item
          label="Nombre"
          name="name"
          className="w-full md:w-1/2"
          rules={[
            {
              required: true,
              type: "string",
              max: 120,
              message: "Por favor verifique el nombre del usuario",
            },
          ]}
        >
          <Input placeholder="Nombre" maxLength={120} />
        </Form.Item>
        <Form.Item
          label="Apellido"
          name="lastName"
          className="w-full md:w-1/2"
          rules={[
            {
              required: true,
              type: "string",
              max: 120,
              message: "Por favor verifique el apellido del usuario",
            },
          ]}
        >
          <Input placeholder="Apellido" maxLength={120} />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Form.Item
          label="Correo"
          name="id"
          className="w-full md:w-1/2"
          rules={[
            {
              required: true,
              type: "email",
              max: 120,
              message: "Por favor verifique el correo del usuario",
            },
          ]}
        >
          <Input
            type="email"
            placeholder="Correo"
            maxLength={120}
            disabled={!!data}
          />
        </Form.Item>
        <Form.Item
          label="Cédula"
          name="identificationNumber"
          className="w-full md:w-1/2"
          rules={[
            {
              required: true,
              message: "Por favor verifique la cédula del usuario",
            },
          ]}
        >
          <InputNumber className="w-full" max={99999999} placeholder="Cédula" />
        </Form.Item>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Form.Item
          name="idRoleId"
          label="Tipo de usuario"
          rules={[{ required: true, message: "Por favor elija una opción" }]}
          className="mb-4 w-full md:w-1/2"
        >
          <Select
            placeholder="Tipo de usuario"
            options={userRoles.map((role) => {
              return {
                label: getUserRoleName(role.id),
                value: role.id,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          name="laboratory"
          label="Laboratorio"
          rules={[{ required: true, message: "Por favor elija una opción" }]}
          className="mb-4 w-full md:w-1/2"
        >
          <Select
            placeholder="Laboratorio"
            options={laboratoryList.map((laboratory) => {
              return {
                label: laboratory.name,
                value: laboratory.id,
              };
            })}
          />
        </Form.Item>
      </div>
      <RequiredLegend />
    </Form>
  );
}
