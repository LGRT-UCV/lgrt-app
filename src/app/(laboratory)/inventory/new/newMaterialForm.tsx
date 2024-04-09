"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, Form, Input } from "antd";
import { Routes } from "@/lib/constants";
import useNotification from "@/hooks/useNotification";
import TextArea from "antd/es/input/TextArea";

type TNewMaterialFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function NewMaterialForm () {
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();

  const onFinish = async (values: TNewMaterialFormData) => {
    const responseNextAuth = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      responseNextAuth.error.split(",").map((error, index) => {
        const msg = error.includes("Bad credentials") || error.includes("CredentialsSignin") ?
          "Email o contraseña inválido" :
          error;
        openNotification("error", msg, "", "topRight");
        console.log("ERROR: ", error);
      });
      return;
    }

    router.push(Routes.Inventory);
  };

  return (
    <div className="max-h-fit overflow-y-auto">
      {notificationElement}
      <Form
        name="new_material"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="horizontal"
        requiredMark="optional"
        size="large"
      >
        <Form.Item
          name="materialName"
          rules={[
            {
              type: "string",
              required: true,
              len: 120,
              message: "Por favor verifique el nombre del nuevo elemento",
            },
          ]}
        >
          <Input placeholder="Nombre del elemento" maxLength={120} />
        </Form.Item>
        <Form.Item
          name="materialDescription"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del elemento",
            },
          ]}
        >
          <TextArea placeholder="Descripción del elemento..." rows={4} maxLength={500}/>
        </Form.Item>
      </Form>
    </div>
  );
};