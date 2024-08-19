import { useState } from "react";
import { Transfer, type TransferProps } from "antd";
import { basicMaterialTypeFields } from "../utils";

interface RecordType {
  key: string;
  name: string;
  required: boolean;
}

const mockData = basicMaterialTypeFields.map<RecordType>((field) => ({
  key: field.key,
  name: field.name,
  required: field.required,
}));

const initialTargetKeys = mockData
  .filter((item) => item.required)
  .map((item) => item.key);

export default function TransferCustomFields() {
  const [targetKeys, setTargetKeys] =
    useState<TransferProps["targetKeys"]>(initialTargetKeys);

  const onChange: TransferProps["onChange"] = (
    nextTargetKeys,
    direction,
    moveKeys,
  ) => {
    console.log("targetKeys:", nextTargetKeys);
    console.log("direction:", direction);
    console.log("moveKeys:", moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange: TransferProps["onSelectChange"] = (
    sourceSelectedKeys,
    targetSelectedKeys,
  ) => {
    console.log("sourceSelectedKeys:", sourceSelectedKeys);
    console.log("targetSelectedKeys:", targetSelectedKeys);
  };

  return (
    <Transfer
      dataSource={mockData}
      className="transfer-custom-fields flex w-full justify-center"
      listStyle={{
        width: 300,
        height: 250,
      }}
      titles={["Campos disponibles", "Campos del tipo de material"]}
      targetKeys={targetKeys}
      onChange={onChange}
      onSelectChange={onSelectChange}
      render={(item) => item.name}
    />
  );
}
