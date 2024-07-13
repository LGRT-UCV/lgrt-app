import { Form, Input, InputNumber } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useStorageForm from "../hooks/useStorageForm";
import TextArea from "antd/es/input/TextArea";
import { IStorage } from "../interfaces";

type TCreateStorageModal = {
  form: FormInstance,
  data?: IStorage,
  closeModal: () => void
};

export default function CreateStorageModal ({ form, data, closeModal } : TCreateStorageModal) {
  const {
    isLoading,
    notificationElement,
    onFinish,
  } = useStorageForm(() => {
    form.resetFields();
    closeModal();
  }, form, data);

  if (isLoading) return (
    <div className="w-full text-center pt-4">
      {notificationElement}
      <LoadingOutlined className="text-3xl" />
    </div>
  );

  return (
    <div>
      {notificationElement}
      <Form
        name="storageForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        scrollToFirstError
        className="p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Form.Item
            label="Identificador"
            name="id"
            className="w-full md:w-1/5"
            rules={[
              {
                required: true,
                message: "Por favor verifique el identificador",
              },
            ]}
          >
            <InputNumber className="w-full" placeholder="Número de identificador" max={9999} />
          </Form.Item>
          <Form.Item
            label="Nombre del almacenamiento"
            name="name"
            className="w-full md:w-4/5"
            rules={[
              {
                required: true,
                type: "string",
                max: 120,
                message: "Por favor verifique el nombre del almacenamiento",
              },
            ]}
          >
            <Input placeholder="Nombre del almacenamiento" maxLength={120} />
          </Form.Item>
        </div>
        <Form.Item
          name="description"
          className="mt-4"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del almacenamiento",
            },
          ]}
        >
          <TextArea placeholder="Descripción del almacenamiento..." rows={4} maxLength={500}/>
        </Form.Item>
      </Form>
    </div>
  );
};