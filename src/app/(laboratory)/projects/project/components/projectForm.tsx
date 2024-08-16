import { Button, Form, Input, InputNumber, TreeSelect } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useProjectForm from "../hooks/useProjectForm";
import type { IProjectForm } from "../../interfaces";
import RequiredLegend from "@/components/feedback/requiredLegend";

export default function ProjectForm({ formIntance }: IProjectForm) {
  const {
    materialList,
    measurements,
    materialsSelected,
    isLoading,
    notificationElement,
    onFinish,
    handleMeasurements,
    handleRemoveMaterial,
  } = useProjectForm(formIntance);

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <div className="max-h-full overflow-y-auto p-2">
      {notificationElement}
      <Form
        name="projectForm"
        form={formIntance}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        <div className="flex flex-wrap justify-between">
          <Form.Item
            label="Nombre del proyecto"
            name="name"
            className="mb-4 w-full px-2 md:w-1/2"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el nombre del proyecto",
              },
            ]}
          >
            <Input placeholder="Nombre del proyecto" maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Responsable del proyecto"
            name="projectManager"
            className="mb-4 w-full px-2 md:w-1/2"
            rules={[
              {
                type: "string",
                required: true,
                max: 120,
                message: "Por favor verifique el responsable del proyecto",
              },
            ]}
          >
            <Input placeholder="Responsable del proyecto" maxLength={120} />
          </Form.Item>
        </div>
        <Form.Item
          label="Descripción"
          name="description"
          className="px-2"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del proyecto",
            },
          ]}
        >
          <TextArea
            placeholder="Descripción del proyecto..."
            rows={4}
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          label="Link del archivo (opcional)"
          name="projectUri"
          className="mb-8 w-full px-2"
          rules={[
            {
              type: "url",
              max: 300,
              min: 6,
              message: "Por favor verifique el link del archivo",
            },
          ]}
        >
          <Input
            placeholder="Link del proyecto"
            minLength={6}
            maxLength={300}
          />
        </Form.Item>

        <Form.List name="projectMaterial">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
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
                          required: true,
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
                          handleMeasurements(option.value, key)
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Cantiadad a usar"
                      name={[name, "quantity"]}
                      className="mb-4 w-full"
                      rules={[
                        {
                          required: true,
                          message: "Por favor verifique la cantidad",
                        },
                        {
                          type: "number",
                          min: 0,
                          max: Number(materialsSelected[key]?.quantity),
                          message: `Cantidad disponible (${materialsSelected[key]?.quantity} ${measurements[key]})`,
                        },
                      ]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="cantidad"
                        min={0}
                        decimalSeparator=","
                        suffix={measurements[key]}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined
                        onClick={() => {
                          handleRemoveMaterial(key);
                          remove(name);
                        }}
                      />
                    )}
                  </div>

                  <p className={`text-xs ${fields.length > 1 ? "mr-12" : ""}`}>
                    Disponibles: {materialsSelected[key]?.quantity}{" "}
                    {measurements[key]}
                  </p>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Agregar material
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      <RequiredLegend />
    </div>
  );
}
