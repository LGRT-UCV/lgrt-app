import { Form, Input, Select } from "antd";

export default function CustomFieldsForm() {
  return (
    <div className="mt-8">
      <h3 className="text-center text-2xl font-semibold">
        Campos personalizados
      </h3>
      <div className="flex flex-wrap justify-between">
        <Form.Item
          label="Texto"
          name="custom:1"
          className="mb-4 w-full px-2 md:w-1/2"
          rules={[
            {
              type: "string",
              required: true,
              max: 120,
              message: "Por favor verifique el texto",
            },
          ]}
        >
          <Input placeholder="Texto" maxLength={120} />
        </Form.Item>
        <Form.Item
          label="Lista"
          name="custom:2"
          rules={[{ required: true, message: "Por favor elija una opción" }]}
          className="mb-4 w-full px-2 md:w-1/2"
        >
          <Select placeholder="Lista" options={[]} />
        </Form.Item>
      </div>
    </div>
  );
}
