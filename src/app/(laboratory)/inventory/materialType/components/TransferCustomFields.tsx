import { useEffect, useState } from "react";
import { type FormInstance, Transfer, type TransferProps } from "antd";
import { basicMaterialTypeFields } from "../utils";
import { type IMaterialType } from "../interfaces";

interface RecordType {
  key: string;
  name: string;
  required: boolean;
  disabled?: boolean;
}

interface TransferCustomFieldsProps {
  form: FormInstance;
  initialFields?: IMaterialType["fields"];
}

const mockData = basicMaterialTypeFields.map<RecordType>((field) => ({
  key: field.key,
  name: field.name,
  required: field.required,
  disabled: field.required,
}));

const initialTargetKeys = mockData
  .filter((item) => item.required)
  .map((item) => item.key);

export default function TransferCustomFields({
  form,
  initialFields,
}: TransferCustomFieldsProps) {
  const [targetKeys, setTargetKeys] =
    useState<TransferProps["targetKeys"]>(initialTargetKeys);

  useEffect(() => {
    if (
      typeof initialTargetKeys === "undefined" ||
      initialTargetKeys.length === 0
    )
      return;
    form.setFieldValue("predefinedFields", initialTargetKeys);
  }, [initialTargetKeys]);

  useEffect(() => {
    if (typeof initialFields === "undefined") return;

    const initialFieldsKeys = initialFields.split(";");
    const initialKeys = mockData
      .filter((field) => initialFieldsKeys.includes(field.key))
      .map((item) => item.key);
    setTargetKeys(initialKeys);
    form.setFieldValue("predefinedFields", initialKeys);
  }, [initialFields]);

  const onChange: TransferProps["onChange"] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
    form.setFieldValue("predefinedFields", nextTargetKeys);
  };

  return (
    <Transfer
      dataSource={mockData}
      className="transfer-custom-fields flex w-full justify-center"
      listStyle={{
        width: 300,
        height: 250,
      }}
      titles={["Campos disponibles", "Campos asignados"]}
      targetKeys={targetKeys}
      onChange={onChange}
      render={(item) => item.name}
      locale={{
        itemsUnit: "campos",
        searchPlaceholder: "Buscar campos",
        selectAll: "Seleccionar todos",
        selectInvert: "Invertir selección",
      }}
    />
  );
}
