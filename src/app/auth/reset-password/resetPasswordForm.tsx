"use client";

import { useRouter, useSearchParams } from "next/navigation"
import Text from "antd/es/typography";
import Title from "antd/es/typography/Title";
import { Button, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { LAB_DETAILS, Routes } from "@/lib/constants";
import useNotification from "@/hooks/useNotification";
import { resetPassword } from "./utils";

type TResetPasswordFormData = {
  token: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPassword () {
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onFinish = async (values: TResetPasswordFormData) => {
    try {
      if (values.password !== values.confirmPassword || values.password.length < 6)
        throw new Error("Verifique su contraseña");

      const email = searchParams.get("email") ?? "";
      await resetPassword(
        email,
        values.token,
        values.password,
        values.confirmPassword
      );
      openNotification(
        "success",
        "Contraseña establecida correctamente",
        "",
        "topRight"
      );
      void router.push(Routes.Login);
    // @ts-expect-error
    } catch (error: Error) {
      const msg = error.message.includes("The user does not have any token available.") || error.message.includes("The token is wrong") ?
          "Token o inválido" :
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
        size="large"
        className="w-3/4 mx-auto"
      >
        <Form.Item
          name="token"
          rules={[
            {
              required: true,
              message: "Por favor ingrese un código válido!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Código de verificación"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor ingrese la nueva contraseña!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Nueva contraseña"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Por favor confirme su contraseña!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Confirmar contraseña"
          />
        </Form.Item>
        <Form.Item className="mb-0">
          <Button block className="bg-brand-primary text-brand-dark-light" htmlType="submit">
            Cambiar contraseña
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
