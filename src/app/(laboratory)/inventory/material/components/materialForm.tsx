import React from "react";
import { Select, Form, Input, InputNumber, DatePicker, Checkbox } from "antd";
import TextArea from "antd/es/input/TextArea";
import NFPAForm from "./nfpaForm";
import type { IMaterialForm } from "../../interfaces";
import useMaterialForm from "../hooks/useMaterialForm";
import BaseMaterialForm from "./baseMaterialForm";
import useMaterialInit from "../hooks/useMaterialInit";
import RequiredLegend from "@/components/feedback/requiredLegend";
import CustomFieldsForm from "./customFieldsForm";

export default function MaterialForm({
  formIntance,
  materialData,
}: IMaterialForm) {
  const {
    currentMaterialType,
    currentMeasurement,
    notificationElement,
    handleCurrentMeasurement,
    hasField,
    onFinish,
    setCurrentMaterialType,
  } = useMaterialForm(formIntance, materialData);
  const { materialTypeList, measurementList, sgaClassification, storagePlace } =
    useMaterialInit();

  return (
    <div className="max-h-full overflow-y-auto p-2">
      {notificationElement}
      <Form
        name="materialForm"
        form={formIntance}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        <BaseMaterialForm
          materialTypeList={materialTypeList}
          setCurrentMaterialType={setCurrentMaterialType}
        />
        {!!currentMaterialType && (
          <>
            <div className="flex flex-wrap gap-2">
              <Form.Item
                name="measurement"
                label="Unidad de medida"
                rules={[
                  { required: true, message: "Por favor elija una opción" },
                ]}
                className="mb-4 w-full md:w-1/3"
              >
                <Select
                  showSearch
                  placeholder="Unidad de medida"
                  optionFilterProp="children"
                  onSelect={(value, obj) => handleCurrentMeasurement(obj.label)}
                  filterOption={(input, option) =>
                    (option?.label.toLowerCase() ?? "").includes(
                      input.toLowerCase(),
                    )
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={measurementList.map((measurement) => {
                    return {
                      label: `${measurement.description} (${measurement.name})`,
                      value: measurement.id,
                    };
                  })}
                />
              </Form.Item>
              {hasField("presentation") && (
                <Form.Item
                  label="Presentación"
                  name="presentation"
                  className="mb-4 w-full md:w-1/3"
                  rules={[
                    {
                      message: "Por favor verifique la presentación",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Presentación"
                    suffix={currentMeasurement}
                  />
                </Form.Item>
              )}
              {hasField("capacity") && (
                <Form.Item
                  label="Capacidad"
                  name="capacity"
                  className="mb-4 w-full md:w-1/3"
                  rules={[
                    {
                      required: Number(currentMaterialType.id) !== 2,
                      message: "Por favor verifique la capacidad",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Capacidad"
                    decimalSeparator=","
                    suffix={currentMeasurement}
                  />
                </Form.Item>
              )}
              {hasField("weight") && (
                <Form.Item
                  label="Peso"
                  name="weight"
                  className="mb-4 w-full md:w-1/3"
                  rules={[
                    {
                      required: Number(currentMaterialType.id) !== 1,
                      message: "Por favor verifique el peso",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Peso"
                    decimalSeparator=","
                    suffix={currentMeasurement}
                  />
                </Form.Item>
              )}
              <Form.Item
                label="Cantidad existente"
                name="quantity"
                className="mb-4 w-full md:w-1/3"
                rules={[
                  {
                    required: Number(currentMaterialType.id) !== 2,
                    message: "Por favor verifique la cantidad",
                  },
                ]}
              >
                <InputNumber
                  className="w-full"
                  placeholder="Cantidad existente"
                  decimalSeparator=","
                  suffix={
                    Number(currentMaterialType.id) !== 2
                      ? currentMeasurement
                      : undefined
                  }
                />
              </Form.Item>

              <Form.Item
                label="Cantidad mínima (opcional)"
                name="minQuantity"
                className="mb-4 w-full md:w-1/3"
                rules={[
                  {
                    required: false,
                    message: "Por favor verifique la cantidad",
                  },
                ]}
              >
                <InputNumber
                  className="w-full"
                  placeholder="Cantidad mínima"
                  decimalSeparator=","
                  suffix={
                    Number(currentMaterialType.id) !== 2
                      ? currentMeasurement
                      : undefined
                  }
                />
              </Form.Item>
            </div>
            {hasField("brand") && (
              <Form.Item
                label="Marca"
                name="brand"
                className=""
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
            )}
            <div className="flex flex-wrap gap-2">
              {hasField("code") && (
                <Form.Item
                  label="Código"
                  name="code"
                  className="mb-4 w-full  md:w-1/3"
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
              )}
              {hasField("batch") && (
                <Form.Item
                  label="Lote"
                  name="batch"
                  className="mb-4 w-full md:w-1/3"
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
              )}
              {hasField("concentration") && (
                <Form.Item
                  label="Concentración"
                  name="concentration"
                  className="mb-4 w-full md:w-1/3"
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Concentración"
                    decimalSeparator=","
                    min={0}
                    max={100}
                    suffix="%"
                  />
                </Form.Item>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {hasField("expirationDate") && (
                <Form.Item
                  label="Fecha de Vencimiento"
                  name="expirationDate"
                  className="mb-4 w-full md:w-1/3"
                  rules={[
                    {
                      type: "date",
                      message: "Por favor verifique la fecha de vencimiento",
                    },
                  ]}
                >
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>
              )}
              {hasField("condition") && (
                <Form.Item
                  label="Condición"
                  name="condition"
                  className="mb-4 w-full md:w-1/3"
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
              )}
              {hasField("storagePlace") && (
                <Form.Item
                  name="storagePlace"
                  label="Lugar de almacenamiento"
                  rules={[
                    { required: true, message: "Por favor elija una opción" },
                  ]}
                  className={`mb-4 w-full md:w-2/3 ${hasField("storagePlace") ? "" : "hidden"}`}
                >
                  <Select
                    showSearch
                    placeholder="Puede crear más lugares de almacenamiento en la sección de Almacén"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label.toLowerCase() ?? "").includes(
                        input.toLowerCase(),
                      )
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={storagePlace.map((storage) => {
                      return {
                        label: `#${storage.id} - ${storage.name}`,
                        value: storage.id,
                      };
                    })}
                  />
                </Form.Item>
              )}
            </div>
            <div className="flex flex-wrap gap-8">
              <Form.Item name="sensibleMaterial" valuePropName="checked">
                <Checkbox>Material sensible</Checkbox>
              </Form.Item>
              <Form.Item name="superUse" valuePropName="checked">
                <Checkbox>Necesita un supervisor</Checkbox>
              </Form.Item>
            </div>
            <Form.Item
              label={`${hasField("additionalInfo") ? "Información adicional" : "Observaciones"}`}
              name={
                hasField("additionalInfo") ? "additionalInfo" : "observations"
              }
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

            <CustomFieldsForm fields={currentMaterialType.customFields} />

            <div className="flex-wrap space-y-8 md:flex md:space-y-0">
              {hasField("nfpaClassif") && <NFPAForm />}

              {hasField("sgaClassif") && (
                <Form.Item
                  label="Clasificación SGA"
                  name="sgaClassif"
                  className="w-full md:w-1/2"
                >
                  <Checkbox.Group className="w-full">
                    <div className="flex flex-wrap justify-between">
                      {sgaClassification.map((sga, index) => {
                        return (
                          <Checkbox
                            key={`sga-${index}`}
                            value={sga.id}
                            className="mb-8 w-1/2 text-base font-bold"
                          >
                            {sga.description}
                          </Checkbox>
                        );
                      })}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              )}
            </div>
          </>
        )}
      </Form>
      <RequiredLegend />
    </div>
  );
}
