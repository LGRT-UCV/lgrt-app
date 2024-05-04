import { useEffect } from "react";
import { Select, Form, Input, InputNumber, DatePicker, Checkbox } from "antd";
import TextArea from "antd/es/input/TextArea";
import NFPAForm from "./nfpaForm";
import type { IMaterialForm } from "../../interfaces";
import useMaterialForm from "../hooks/useMaterialForm";
import BaseMaterialForm from "./baseMaterialForm";
import useMaterialInit from "../hooks/useMaterialInit";

export default function MaterialForm ({
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
  const {
    materialTypeList,
    measurementList,
    sgaClassification,
    storagePlace,
  } = useMaterialInit();
  const hideFormClass = !!currentMaterialType ? "" : "hidden";

  return (
    <div className="max-h-full overflow-y-auto p-2">
      {notificationElement}
      <Form
        name="materialForm"
        form={formIntance}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        scrollToFirstError
      >
        <BaseMaterialForm materialTypeList={materialTypeList} setCurrentMaterialType={setCurrentMaterialType} />
        <div className={hideFormClass}>
          <div className="flex flex-wrap justify-between">
            <Form.Item
              name="measurement"
              label="Unidad de medida"
              rules={[{ required: true, message: "Por favor elija una opción" }]}
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("measurement") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("presentation") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("capacity") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("weight") ? "" : "hidden"}`}
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
              label="Cantidad existente"
              name="quantity"
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("quantity") ? "" : "hidden"}`}
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
            className={`px-2 ${hasField("brand") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("code") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("batch") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("concentration") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("expirationDate") ? "" : "hidden"}`}
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
              className={`w-full md:w-1/3 px-2 mb-4 ${hasField("condition") ? "" : "hidden"}`}
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
              name="storagePlace"
              label="Lugar de almacenamiento"
              rules={[{ required: true, message: "Por favor elija una opción" }]}
              className={`w-full md:w-2/3 px-2 mb-4 ${hasField("storagePlace") ? "" : "hidden"}`}
            >
              <Select
                showSearch
                placeholder="Lugar de almacenamiento"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={storagePlace.map((storage) => {
                  return {
                    label: `${storage.name}`,
                    value: storage.id,
                  }
                })}
              />
            </Form.Item>
          </div>
          <div className="flex flex-wrap gap-8">
            <Form.Item
              name="sensibleMaterial"
              valuePropName="checked"
            >
              <Checkbox>
                Material sensible
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="superUse"
              valuePropName="checked"
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
        </div>
      </Form>
    </div>
  );
};