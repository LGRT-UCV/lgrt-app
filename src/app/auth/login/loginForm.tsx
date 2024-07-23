"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Text from "antd/es/typography";
import Title from "antd/es/typography/Title";
import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { LAB_DETAILS, Routes } from "@/lib/constants";
import useNotification from "@/hooks/useNotification";

type TLoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();

  const onFinish = async (values: TLoginFormData) => {
    const responseNextAuth = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      responseNextAuth.error.split(",").map((error) => {
        const msg =
          error.includes("Bad credentials") ||
          error.includes("CredentialsSignin")
            ? "Email o contraseña inválido"
            : error;
        openNotification("error", msg, "", "topRight");
        console.log("ERROR: ", error);
      });
      return;
    }

    router.push(Routes.Inventory);
  };

  return (
    <>
      {notificationElement}
      <div className="my-8 text-center">
        <Title className="py-2">Iniciar Sesión</Title>
        <Text className="mx-auto w-3/4 py-4">
          {`Bienvenido al ${LAB_DETAILS.longName}. Por favor ingrese los datos abajo para iniciar sesión`}
        </Text>
      </div>
      <Form
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
        
        size="large"
        className="mx-auto w-3/4"
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
          <Input prefix={<MailOutlined />} placeholder="Correo" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor ingrese su contraseña!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Contraseña"
          />
        </Form.Item>
        <Form.Item>
          <Link className="float-right" href={Routes.RequestResetPassword}>
            Olvidé mi contraseña
          </Link>
        </Form.Item>
        <Form.Item className="mb-0">
          <Button
            block
            className="bg-brand-primary text-brand-dark-light"
            htmlType="submit"
          >
            Iniciar sesión
          </Button>
          {/* <div className="mt-16 text-center w-full">
            <Text className="text-brand-secondary">¿No tienes una cuenta?</Text>{" "}
            <Link href="">Sign up now</Link>
          </div> */}
        </Form.Item>
      </Form>
    </>
  );
}
