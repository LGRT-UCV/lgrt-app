"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Select, Form, Input, InputNumber, DatePicker, Checkbox } from "antd";
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
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
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
        name="materialForm"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
      >
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Nombre del material"
            name="materialName"
            className="w-full md:w-2/3 px-2 mb-4"
            rules={[
              {
                type: "string",
                required: true,
                min: 120,
                message: "Por favor verifique el nombre del elemento",
              },
            ]}
          >
            <Input placeholder="Nombre del material" maxLength={120} />
          </Form.Item>
          <Form.Item
            name="materialType"
            label="Unidad de medida"
            rules={[{ required: true, message: "Por favor elija una opción" }]}
            className="w-full md:w-1/3 px-2 mb-4"
          >
            <Select
              placeholder="Tipo de material"
              options={materialTypeList.map((materialType) => {
                return {
                  label: materialType.name,
                  value: materialType.id,
                }
              })}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="description"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del material",
            },
          ]}
        >
          <TextArea placeholder="Descripción del material..." rows={4} maxLength={500}/>
        </Form.Item>
        <div className="flex flex-wrap justify-between">
          <Form.Item
            name="measurement"
            label="Unidad de medida"
            rules={[{ required: true, message: "Por favor elija una opción" }]}
            className="w-full md:w-1/3 px-2 mb-4"
          >
            <Select
              showSearch
              placeholder="Unidad de medida"
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
            label="Presentación"
            name="presentation"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                message: "Por favor verifique la presentación",
              },
            ]}
          >
            <Input type="number" placeholder="Presentación" suffix={currentMeasurement}/>
          </Form.Item>
          <Form.Item
            label="Capacidad"
            name="capacity"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                required: true,
                message: "Por favor verifique la capacidad",
              },
            ]}
          >
            <InputNumber className="w-full" placeholder="Capacidad" suffix={currentMeasurement}/>
          </Form.Item>
          <Form.Item
            label="Peso"
            name="weight"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                required: true,
                message: "Por favor verifique el peso",
              },
            ]}
          >
            <InputNumber className="w-full" placeholder="Peso" suffix={currentMeasurement}/>
          </Form.Item>
          <Form.Item
            label="Peso"
            name="quantity"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                required: true,
                message: "Por favor verifique la cantidad",
              },
            ]}
          >
            <InputNumber className="w-full" placeholder="Cantidad existente" suffix={currentMeasurement}/>
          </Form.Item>
        </div>
        <Form.Item
          label="Marca"
          name="brand"
          className="px-2"
          rules={[
            {
              type: "string",
              max: 120,
              message: "Por favor verifique la marca",
            },
          ]}
        >
          <Input placeholder="Marca" maxLength={120} />
        </Form.Item>
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Código"
            name="code"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                type: "string",
                max: 60,
                message: "Por favor verifique el código",
              },
            ]}
          >
            <Input placeholder="Código" maxLength={60} />
          </Form.Item>
          <Form.Item
            label="Lote"
            name="batch"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                type: "string",
                max: 60,
                message: "Por favor verifique el lote",
              },
            ]}
          >
            <Input placeholder="Lote" maxLength={60} />
          </Form.Item>
          <Form.Item
            label="Concentración"
            name="concentration"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                type:"number",
                min: 0,
                max: 100,
                message: "Por favor verifique la concentración",
              },
            ]}
          >
            <InputNumber className="w-full" placeholder="Concentración" min={0} max={100} suffix="%" />
          </Form.Item>
        </div>
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Fecha de Vencimiento"
            name="expirationDate"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                type: "date",
                message: "Por favor verifique la fecha de vencimiento",
              },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Condición"
            name="condition"
            className="w-full md:w-1/3 px-2 mb-4"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el Condición",
              },
            ]}
          >
            <Input placeholder="Condición" maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Lugar de almacenamiento"
            name="storagePlace"
            className="w-full md:w-2/3 px-2 mb-4"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el lugar de almacenamiento",
              },
            ]}
          >
            <Input placeholder="Lugar de almacenamiento" maxLength={120} />
          </Form.Item>
        </div>
        <div className="flex flex-wrap gap-8">
          <Form.Item
            name="sensibleMaterial"
          >
            <Checkbox>
              Material sensible
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="superUse"
          >
            <Checkbox>
              Necesita un supervisor
            </Checkbox>
          </Form.Item>
        </div>
        <Form.Item
          name="observations"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del elemento",
            },
          ]}
        >
          <TextArea placeholder="Observaciones del elemento..." rows={4} maxLength={500}/>
        </Form.Item>
      </Form>
    </div>
  );
};