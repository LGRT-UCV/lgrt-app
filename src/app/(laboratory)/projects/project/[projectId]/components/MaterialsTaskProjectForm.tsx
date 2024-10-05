import { Button, Card, Form, InputNumber, Select } from "antd";
import {
  LoadingOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type {
  IProjectTask,
  TProjectMaterial,
} from "@/(laboratory)/projects/interfaces";
import useTaskForm from "../hooks/useTaskForm";

type TMaterialsTaskProjectForm = {
  currentTask: string;
  tasks: Array<IProjectTask>;
  materialsProject: Array<TProjectMaterial>;
  projectStatus: string;
  openModal: boolean;
};

export default function MaterialsTaskProjectForm({
  currentTask,
  tasks,
  materialsProject,
  projectStatus,
  openModal,
}: TMaterialsTaskProjectForm) {
  const {
    isLoading,
    notificationElement,
    materialsSelected,
    quantitiesSelected,
    currentTaskData,
    materialList,
    materialsUsed,
    handleMaterialSelected,
    handleQuantitySelected,
    handleRemoveMaterial,
  } = useTaskForm({
    openModal,
    currentTask,
    tasks,
    materialsProject,
    projectStatus,
  });

  if (isLoading) return <LoadingOutlined className="mx-auto" />;

  return (
    <div>
      {notificationElement}
      <Form.List name="projectTaskMaterials">
        {(fields, { add, remove }) => (
          <div className="space-y-4">
            {fields.map(({ key, name, ...restField }) => {
              const materialsToList = [...(materialList ?? [])];
              const currentMaterial = materialList?.find(
                (material) => material.id === materialsSelected[name],
              );
              const currentQuantity = quantitiesSelected[name] ?? 0;
              const overflowQuantity =
                materialsUsed
                  .filter(
                    (material) => material.idMaterial === currentMaterial?.id,
                  )
                  .reduce(
                    (accumulator, currentValue) =>
                      accumulator + Number(currentValue.usedQuantity),
                    0,
                  ) ?? 0;
              const isOverflowQuantity =
                overflowQuantity + currentQuantity >
                Number(currentMaterial?.projectQuantity);
              const materials = materialsToList?.filter(
                (material) =>
                  !materialsSelected
                    .filter((mat) => mat !== materialsSelected[name])
                    .includes(material.id),
              );

              return (
                <Card
                  size="small"
                  title={`Material a usar #${name + 1}`}
                  key={key}
                  extra={
                    !currentMaterial?.disabled ? (
                      <CloseOutlined
                        onClick={() => {
                          handleRemoveMaterial(name);
                          remove(name);
                        }}
                      />
                    ) : null
                  }
                >
                  <div className="flex w-full flex-wrap">
                    <Form.Item
                      {...restField}
                      label="Material"
                      name={[name, "idMaterial"]}
                      className="mb-4 w-full"
                      shouldUpdate
                      rules={[
                        {
                          required: true,
                          message: "Por favor elija un material",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Seleccione un material"
                        onSelect={(value) =>
                          handleMaterialSelected(value, name)
                        }
                        disabled={currentMaterial?.disabled}
                        options={materials?.map((material) => {
                          return {
                            label: `#${material.id} - ${material.name} (${material.materialType.name})`,
                            value: material.id,
                          };
                        })}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Cantidad a usar"
                      name={[name, "usedQuantity"]}
                      className="mb-4 w-full"
                      rules={[
                        {
                          required: true,
                          message: "Por favor verifique la cantidad",
                        },
                        {
                          type: "number",
                          min: 0,
                          max: Number(currentMaterial?.quantity),
                          message: `Cantidad disponible (${currentMaterial?.quantity} ${Number(currentMaterial?.materialType.id) !== 2 ? currentMaterial?.measurement.name : ""})`,
                        },
                      ]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="cantidad"
                        onChange={(value) =>
                          handleQuantitySelected(value ?? 0, name)
                        }
                        min={0}
                        decimalSeparator=","
                        suffix={
                          Number(currentMaterial?.materialType.id) !== 2
                            ? currentMaterial?.measurement.name
                            : undefined
                        }
                        disabled={currentMaterial?.disabled}
                      />
                    </Form.Item>
                  </div>

                  {currentMaterial && (
                    <ul className="ml-4 list-disc">
                      <li className="text-xs">
                        Disponibles: {currentMaterial?.quantity}{" "}
                        {Number(currentMaterial.materialType.id) !== 2
                          ? currentMaterial?.measurement.name
                          : ""}
                      </li>

                      <li
                        className={`text-xs ${isOverflowQuantity ? "text-orange-400" : ""}`}
                      >
                        Estimado para el proyecto:{" "}
                        {currentMaterial?.projectQuantity}{" "}
                        {Number(currentMaterial.materialType.id) !== 2
                          ? currentMaterial?.measurement.name
                          : ""}
                      </li>
                    </ul>
                  )}
                </Card>
              );
            })}
            <Form.Item className="mt-8">
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                disabled={
                  materialsSelected.length === materialList?.length ||
                  (currentTaskData && currentTaskData.status === "C") ||
                  !["A"].includes(projectStatus)
                }
              >
                Agregar material
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </div>
  );
}
