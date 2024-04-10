"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Select, Form, Input } from "antd";
import { Routes } from "@/lib/constants";
import useNotification from "@/hooks/useNotification";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { getMaterialTypes, getMeasurements } from "../utils";

type TNewMaterialFormData = {
  email: string;
  password: string;
  remember: boolean;
};

type TMaterialType = {
  name: string;
  fields: string;
  id: string;
};

type TMeasurements = {
  name: string;
  description: string;
  id: string;
}

export default function NewMaterialForm () {
  const [measurementList, setMeasurementList] = useState<Array<TMeasurements>>([]);
  const [materialTypeList, setMaterialTypeList] = useState<Array<TMaterialType>>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const getFormData = async () => {
      const measurementsResponse: TMeasurements[] = await getMeasurements();
      const materialTypeResponse: TMaterialType[] = await getMaterialTypes();
      setMeasurementList(measurementsResponse);
      setMaterialTypeList(materialTypeResponse);
    };

    void getFormData();
  }, []);

  const handleCurrentMeasurement = (value: string) => {
    // const regex = /\((.*?)\)/;
    // const measurement = regex.exec(value)
    setCurrentMeasurement(value);
  };

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
        <div className="flex gap-8">
          <Form.Item
            label="Unidad de medida"
            name="measurement"
            rules={[{ required: true, message: "Por favor elija una opción" }]}
            className="w-1/3"
          >
            <Select
              showSearch
              optionFilterProp="children"
              onSelect={(value, obj) => handleCurrentMeasurement(obj.label)}
              filterOption={(input, option) => (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={measurementList.map((measurement) => {
                return {
                  label: `${measurement.description} (${measurement.name})`,
                  value: measurement.id,
                }
              })}
            />
          </Form.Item>
          <Form.Item
            name="presentation"
            className="w-1/3"
            rules={[
              {
                type: "number",
                required: true,
                message: "Por favor verifique la presentación",
              },
            ]}
          >
            <Input type="number" placeholder="Presentación" suffix={currentMeasurement}/>
          </Form.Item>
          <Form.Item
            name="quantity"
            className="w-1/3"
            rules={[
              {
                type: "number",
                required: true,
                message: "Por favor verifique la cantidad",
              },
            ]}
          >
            <Input type="number" placeholder="Cantidad existente" suffix={currentMeasurement}/>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};