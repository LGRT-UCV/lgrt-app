import { signOut, useSession } from "next-auth/react";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { LockOutlined } from "@ant-design/icons";
import useNotification from "@/hooks/useNotification";
import { resetPassword } from "../utils";
import type { TResetPasswordFormData } from "../interfaces";

export default function ResetPassword() {
  const [form] = useForm();
  const { data: sessionData } = useSession();
  const { openNotification, notificationElement } = useNotification();

  const onFinish = async (values: TResetPasswordFormData) => {
    try {
      const userData = sessionData?.user.user;
      if (typeof userData === "undefined") {
        openNotification("error", "Sesión vencida", "", "topRight");
        await signOut();
      }
      if (
        values.newPassword !== values.passwordConfirmation ||
        values.newPassword.length < 6 ||
        values.currentPassword.length < 6
      )
        throw new Error("Verifique su contraseña");

      await resetPassword(
        userData?.id ?? "",
        values,
        sessionData?.user.token ?? "",
      );
      form.resetFields();
      openNotification(
        "success",
        "Contraseña establecida correctamente",
        "",
        "topRight",
      );
      // @ts-expect-error
    } catch (error: Error) {
      const msg =
        error.message.includes("The actual password does not match") ||
        error.message.includes("Access Denied") ||
        error.message.includes("The new password does not match")
          ? "Contraseña inválida"
          : error.message;
      openNotification("error", msg, "", "topRight");
      console.error("ERROR: ", error);
    }
  };

  return (
    <div>
      {notificationElement}
      <Form
        form={form}
        name="resetPassword"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        className="mx-auto w-3/4"
      >
        <Form.Item
          name="currentPassword"
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
            placeholder="Contraseña actual"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
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
          name="passwordConfirmation"
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
          <Button
            block
            className="bg-brand-primary text-brand-dark-light"
            htmlType="submit"
          >
            Cambiar contraseña
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
