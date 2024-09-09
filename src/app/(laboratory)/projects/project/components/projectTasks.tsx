import { Button, Card, Form, Input } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export default function ProjectTasks() {
  return (
    <Form.List name="projectTasks">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Card
              size="small"
              title={`Tarea #${name + 1}`}
              key={key}
              extra={
                <CloseOutlined
                  onClick={() => {
                    remove(name);
                  }}
                />
              }
            >
              <div className="w-full">
                <Form.Item
                  {...restField}
                  label="Nombre de la tarea"
                  name={[name, "name"]}
                  className="w-full"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      max: 120,
                      message: "Por favor verifique el nombre de la tarea",
                    },
                  ]}
                >
                  <Input placeholder="Nombre de la tarea" maxLength={120} />
                </Form.Item>

                <Form.Item
                  label="Descripción"
                  name="description"
                  className="px-2"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      max: 500,
                      message: "Por favor verifique la descripción de la tarea",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="Descripción de la tarea..."
                    rows={4}
                    maxLength={500}
                  />
                </Form.Item>
              </div>
            </Card>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Agregar tarea
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}
