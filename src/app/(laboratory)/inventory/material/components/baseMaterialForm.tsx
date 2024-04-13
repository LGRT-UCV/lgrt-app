import type { Dispatch, SetStateAction } from "react";
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { TMaterialType } from "../../interfaces";

interface IBaseMaterialForm {
  materialTypeList: Array<TMaterialType>;
  setCurrentMaterialType: Dispatch<SetStateAction<TMaterialType | undefined>>;
}

export default function BaseMaterialForm ({
  materialTypeList,
  setCurrentMaterialType,
} : IBaseMaterialForm) {
  return (
    <>
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
        className="px-2"
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
    </>
  );
};