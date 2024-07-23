import { Button, Form, Input, InputNumber, TreeSelect } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import useProjectForm from "../hooks/useProjectForm";
import type { IProjectForm } from "../../interfaces";

export default function ProjectForm({ formIntance }: IProjectForm) {
  const {
    materialList,
    measurements,
    isLoading,
    notificationElement,
    onFinish,
    handleMeasurements,
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
                max: 120,
                message: "Por favor verifique el responsable del proyecto",
              },
            ]}
          >
            <Input placeholder="Responsable del proyecto" maxLength={120} />
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
          className="mb-4 w-full px-2"
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
                <div
                  key={key}
                  className="flex w-full flex-col gap-4 md:flex-none md:gap-8"
                >
                  <Form.Item
                    {...restField}
                    label="Materiales a usar"
                    name={[name, "idMaterial"]}
                    className="mb-4 w-full"
                    shouldUpdate
                  >
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                      placeholder="Please select"
                      allowClear
                      treeData={materialList}
                      filterTreeNode={(input, option) =>
                        (String(option?.title).toLowerCase() ?? "").includes(
                          input.toLowerCase(),
                        )
                      }
                      onSelect={(_, option) => handleMeasurements(option.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Cantiadad a user"
                    name={[name, "quantity"]}
                    className="mb-4 w-full"
                    rules={[
                      {
                        required: true,
                        message: "Por favor verifique la cantidad",
                      },
                    ]}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder="cantidad"
                      min={0}
                      max={100}
                      decimalSeparator=","
                      suffix={measurements[key]}
                    />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  )}
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

        {/* <Form.Item
          label="Archivos"
          name="file"
          className="w-full md:w-1/2 px-2 mb-4"
          rules={[
            {
              type: "string",
              required: true,
              max: 120,
              message: "Por favor verifique el responsable del proyecto",
            },
          ]}
        >
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Subir archivo</div>
            </button>
        </Upload>
        </Form.Item> */}
      </Form>
    </div>
  );
}
