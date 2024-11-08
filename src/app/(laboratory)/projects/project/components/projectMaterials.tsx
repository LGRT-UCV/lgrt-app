import React from "react";
import { Form, Button, InputNumber, TreeSelect } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { TMaterial } from "@/(laboratory)/inventory/interfaces";
import type { IProject } from "../../interfaces";

type MaterialList = {
  value: string;
  title: string;
  disabled: boolean;
  children: {
    value: string;
    title: string;
  }[];
};

interface IProjectMaterials {
  projectData?: IProject;
  materialList?: MaterialList[];
  measurements: string[];
  materialsSelected: TMaterial[];
  handleMeasurements: (idMaterial: string, key: number) => void;
  handleRemoveMaterial: (key: number) => void;
}

export default function ProjectMaterials({
  projectData,
  materialList,
  measurements,
  materialsSelected,
  handleMeasurements,
  handleRemoveMaterial,
}: IProjectMaterials) {
  return (
    <Form.List name="projectMaterial">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            const currentMaterial = materialsSelected[name];
            const isDisabled =
              projectData &&
              (projectData?.status !== "A" ||
                projectData?.projectTasks.some(
                  (task) =>
                    task.projectTaskMaterials.some(
                      (material) => material.idMaterial === currentMaterial?.id,
                    ) && task.status === "D",
                ));
            return (
              <div key={key} className="mb-4 flex flex-col items-end px-2">
                <div className="flex w-full gap-8">
                  <Form.Item
                    {...restField}
                    label="Material"
                    name={[name, "idMaterial"]}
                    className="mb-4 w-full"
                    shouldUpdate
                    rules={[
                      {
                        required: false,
                        message: "Por favor elija un material",
                      },
                    ]}
                  >
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                      placeholder="Por favor seleccione"
                      allowClear
                      treeData={materialList}
                      filterTreeNode={(input, option) =>
                        (String(option?.title).toLowerCase() ?? "").includes(
                          input.toLowerCase(),
                        )
                      }
                      onSelect={(_, option) =>
                        handleMeasurements(option.value, name)
                      }
                      disabled={isDisabled}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Cantidad estimada a usar"
                    name={[name, "quantity"]}
                    className="mb-4 w-full"
                    rules={[
                      {
                        required: false,
                        message: "Por favor verifique la cantidad",
                      },
                      {
                        type: "number",
                        min: 0,
                        max: !isDisabled
                          ? Number(currentMaterial?.quantity)
                          : undefined,
                        message: `Cantidad disponible (${currentMaterial?.quantity} ${Number(currentMaterial?.materialType.id) !== 2 ? measurements[name] : ""})`,
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="cantidad"
                      min={0}
                      decimalSeparator=","
                      suffix={
                        Number(currentMaterial?.materialType.id) !== 2
                          ? measurements[name]
                          : undefined
                      }
                      disabled={isDisabled}
                    />
                  </Form.Item>
                  {!isDisabled && (
                    <MinusCircleOutlined
                      onClick={() => {
                        handleRemoveMaterial(name);
                        remove(name);
                      }}
                    />
                  )}
                </div>

                {!isDisabled && (
                  <p className={`text-xs ${fields.length > 1 ? "mr-12" : ""}`}>
                    Disponibles: {currentMaterial?.quantity}{" "}
                    {Number(materialsSelected[name]?.materialType.id) !== 2
                      ? measurements[name]
                      : ""}
                  </p>
                )}
              </div>
            );
          })}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              disabled={projectData && projectData?.status !== "A"}
            >
              Agregar material
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}
