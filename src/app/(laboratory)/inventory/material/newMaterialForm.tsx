import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Select, Form, Input, InputNumber, DatePicker, Checkbox } from "antd";
import type { FormInstance } from "antd/lib";
import useNotification from "@/hooks/useNotification";
import TextArea from "antd/es/input/TextArea";
import { getMaterialTypes, getMeasurements, getSGAClassification } from "../utils";
import { Routes } from "@/lib/constants";
import NFPAForm from "./nfpaForm";

type TNewMaterialFormData = {
  name: string;
  description: string;
  presentation: string;
  quantity: string;
  brand: string;
  batch: string;
  concentration: string;
  storagePlace: string;
  expirationDate: string;
  observations: string;
  condition: string;
  weight: string;
  additionalInfo: string;
  capacity: string;
  code: string;
  superUse: boolean;
  sensibleMaterial: boolean;
  materialType: string;
  measurement: string;
  nfpaClassif: {
    nfpaBlue: number;
    nfpaRed: number;
    nfpaYellow: number;
    nfpaWhite: string;
  };
  sgaClassif: Array<{ idSgaClassif: string }>
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

type TSGAClassification = {
  name: string;
  description: string;
  id: number;
};

interface IMaterialForm {
  formIntance: FormInstance;
};

export default function MaterialForm ({
  formIntance
}: IMaterialForm) {
  const [measurementList, setMeasurementList] = useState<Array<TMeasurements>>([]);
  const [materialTypeList, setMaterialTypeList] = useState<Array<TMaterialType>>([]);
  const [sgaClassification, setSgaClassification] = useState<Array<TSGAClassification>>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const getFormData = async () => {
      const measurementsResponse: TMeasurements[] = await getMeasurements();
      const materialTypeResponse: TMaterialType[] = await getMaterialTypes();
      const sgaResponse: TSGAClassification[] = await getSGAClassification();
      setMeasurementList(measurementsResponse);
      setMaterialTypeList(materialTypeResponse);
      setSgaClassification(sgaResponse);
    };

    void getFormData();
  }, []);

  useEffect(() => {
    if (typeof currentMaterialType === "undefined") return;
    formIntance.resetFields([
      "measurement",
      "presentation",
      "capacity",
      "weight",
      "quantity",
      "brand",
      "code",
      "batch",
      "concentration",
      "expirationDate",
      "condition",
      "storagePlace",
      "sensibleMaterial",
      "superUse",
      "additionalInfo",
      "observations",
    ]);
  }, [currentMaterialType]);

  const handleCurrentMeasurement = (value: string) => {
    setCurrentMeasurement(value);
  };

  const onFinish = async (values: any) => {
    try {
      console.log("Values", values)
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al guardar el elemento", "", "topRight");
      console.log("ERROR: ", error);
    }

    //router.push(Routes.Inventory);
  };

  const hasField = (field: string) => {
    if (typeof currentMaterialType === "undefined") return false;
    const availableFields = currentMaterialType.fields.split(";");
    return availableFields.includes(field);
  };

  return (
    <div className="max-h-full overflow-y-auto p-2">
      {notificationElement}
      <Form
        name="materialForm"
        form={formIntance}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        scrollToFirstError
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
                max: 120,
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
              onSelect={(value: string) => setCurrentMaterialType(JSON.parse(value))}
              options={materialTypeList.map((materialType) => {
                return {
                  label: materialType.name,
                  value: JSON.stringify(materialType),
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
        {!!currentMaterialType && <>
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
            {hasField("presentation") &&
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
            }
            {hasField("capacity") &&
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
            }
            {hasField("weight") &&
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
            }
            <Form.Item
              label="Cantidad existente"
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
          {hasField("brand") &&
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
          }
          <div className="flex flex-wrap justify-between">
            {hasField("code") &&
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
            }
            {hasField("batch") &&
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
            }
            {hasField("concentration") &&
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
            }
          </div>
          <div className="flex flex-wrap justify-between">
            {hasField("expirationDate") &&
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
            }
            {hasField("condition") &&
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
            }
            {hasField("storagePlace") &&
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
            }
          </div>
          <div className="flex flex-wrap gap-8">
            <Form.Item
              name="sensibleMaterial"
              initialValue={false}
            >
              <Checkbox>
                Material sensible
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="superUse"
              initialValue={false}
            >
              <Checkbox>
                Necesita un supervisor
              </Checkbox>
            </Form.Item>
          </div>
          <Form.Item
            name={hasField("additionalInfo") ? "additionalInfo" : "observations"}
            rules={[
              {
                type: "string",
                required: true,
                max: 500,
                message: `Por favor verifique la${hasField("additionalInfo") ? " información adicional" : "s observaciones"}`,
              },
            ]}
          >
            <TextArea
              placeholder={`${hasField("additionalInfo") ? "Información adicional" : "Observaciones"} del material...`}
              rows={4}
              maxLength={500}
            />
          </Form.Item>

          <div className="flex flex-wrap">
            <NFPAForm />

            <Form.Item
              label="Clasificación SGA"
              name="sgaClassif"
              className="w-1/2"
            >
              <Checkbox.Group className="w-full">
                <div className="flex flex-wrap justify-between">
                  {sgaClassification.map((sga, index) => {
                    return (
                      <Checkbox
                        key={`sga-${index}`}
                        value={sga.id}
                        className="w-1/2 mb-8 font-bold text-base"
                      >
                        {sga.description}
                      </Checkbox>
                    );
                  })}
                </div>
              </Checkbox.Group>
            </Form.Item>
          </div>
        </>}
      </Form>
    </div>
  );
};