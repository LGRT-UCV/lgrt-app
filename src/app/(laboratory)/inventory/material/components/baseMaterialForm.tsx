import React, { type Dispatch, type SetStateAction } from "react";
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { TMaterialType } from "../../interfaces";

interface IBaseMaterialForm {
  materialTypeList: Array<TMaterialType>;
  setCurrentMaterialType: Dispatch<SetStateAction<TMaterialType | undefined>>;
}

export default function BaseMaterialForm({
  materialTypeList,
  setCurrentMaterialType,
}: IBaseMaterialForm) {
  return (
    <>
      <div className="flex flex-wrap justify-between">
        <Form.Item
          label="Nombre del material"
          name="name"
          className="mb-4 w-full px-2 md:w-2/3"
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
          label="Tipo de material"
          rules={[{ required: true, message: "Por favor elija una opción" }]}
          className="mb-4 w-full px-2 md:w-1/3"
        >
          <Select
            placeholder="Tipo de material"
            onSelect={(value: string) =>
              setCurrentMaterialType(
                materialTypeList.find((type) => type.id === value),
              )
            }
            options={materialTypeList.map((materialType) => {
              return {
                label: materialType.name,
                value: materialType.id,
              };
            })}
          />
        </Form.Item>
      </div>
      <Form.Item
        name="description"
        label="Descripción"
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
        <TextArea
          placeholder="Descripción del material..."
          rows={4}
          maxLength={500}
        />
      </Form.Item>
    </>
  );
}
