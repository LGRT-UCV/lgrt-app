import { Button, Form, Input } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function ProjectTasks() {
  return (
    <Form.List name="projectTasks">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key} className="mb-4 flex gap-8 pr-4">
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
              <MinusCircleOutlined
                onClick={() => {
                  remove(name);
                }}
              />
            </div>
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
