import { Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useStorageForm from "../hooks/useStorageForm";
import TextArea from "antd/es/input/TextArea";
import { IStorage } from "../interfaces";
import RequiredLegend from "@/components/feedback/requiredLegend";

type TCreateStorageModal = {
  form: FormInstance;
  data?: IStorage;
  closeModal: () => void;
};

export default function CreateStorageModal({
  form,
  data,
  closeModal,
}: TCreateStorageModal) {
  const { isLoading, notificationElement, onFinish } = useStorageForm(
    () => {
      form.resetFields();
      closeModal();
    },
    form,
    data,
  );

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
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
        size="large"
        scrollToFirstError
        className="p-4"
      >
        <div className="flex flex-col gap-4 md:flex-row">
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
            <Input
              className="w-full"
              placeholder="Identificador"
              disabled={!!data}
              maxLength={6}
            />
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
          label="Descripción"
          name="description"
          className="mt-2"
          rules={[
            {
              type: "string",
              required: true,
              max: 500,
              message: "Por favor verifique la descripción del almacenamiento",
            },
          ]}
        >
          <TextArea
            placeholder="Descripción del almacenamiento..."
            rows={4}
            maxLength={500}
          />
        </Form.Item>
      </Form>
      <RequiredLegend />
    </div>
  );
}
