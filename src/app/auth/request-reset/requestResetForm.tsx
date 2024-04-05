"use client";

import { useRouter } from "next/navigation";
import Text from "antd/es/typography";
import Title from "antd/es/typography/Title";
import { Button, Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { LAB_DETAILS, Routes } from "@/lib/constants";
import useNotification from "@/hooks/useNotification";
import { requestResetPassword } from "./utils";

type TRequestResetFormData = {
  email: string;
};

export default function RequestResetPassword () {
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();

  const onFinish = async (values: TRequestResetFormData) => {
    try {
      await requestResetPassword(values.email);
      
      openNotification(
        "success",
        "Código de Verificación enviado!",
        "Se ha enviado un código de verificación a su correo",
        "topRight"
      );
      void router.push(`${Routes.ResetPassword}?email=${values.email}`);
    // @ts-expect-error
    } catch (error: Error) {
      const msg = error.message.includes("Bad credentials") || error.message.includes("Non existent user") ?
          "Email inválido" :
          error.message;
      openNotification("error", msg, "", "topRight");
      console.log("ERROR: ", error);
    }
  };

  return (
    <>
      {notificationElement}
      <div className="text-center my-8">
        <Title className="py-2">Recuperar contraseña</Title>
        <Text className="py-4 w-3/4 mx-auto">
          {`Bienvenido al ${LAB_DETAILS.longName}. Por favor ingrese su email para recuperar su contraseña`}
        </Text>
      </div>
      <Form
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        className="w-3/4 mx-auto"
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Por favor ingrese su correo!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Correo"
          />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button block className="bg-brand-primary text-brand-dark-light" htmlType="submit">
            Verificar correo
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
