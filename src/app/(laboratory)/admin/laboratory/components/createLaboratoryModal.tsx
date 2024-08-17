import { Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useLaboratoryForm from "../hooks/useLaboratoryForm";
import TextArea from "antd/es/input/TextArea";
import { ILaboratory } from "../interfaces";
import RequiredLegend from "@/components/feedback/requiredLegend";

type TCreateLaboratoryModal = {
  form: FormInstance;
  data?: ILaboratory;
  closeModal: () => void;
};

export default function CreateLaboratoryModal({
  form,
  data,
  closeModal,
}: TCreateLaboratoryModal) {
  const { isLoading, notificationElement, onFinish } = useLaboratoryForm(
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
        name="laboratoryForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
        className="p-4"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <Form.Item
            label="Nombre del laboratorio"
            name="name"
            className="w-full md:w-2/3"
            rules={[
              {
                required: true,
                type: "string",
                max: 120,
                message: "Por favor verifique el nombre del laboratorio",
              },
            ]}
          >
            <Input placeholder="Nombre del laboratorio" maxLength={120} />
          </Form.Item>
          <Form.Item
            label="Área"
            name="area"
            className="w-full md:w-1/3"
            rules={[
              {
                required: true,
                type: "string",
                max: 120,
                message: "Por favor verifique el área del laboratorio",
              },
            ]}
          >
            <Input placeholder="Área del laboratorio" maxLength={120} />
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
              message: "Por favor verifique la descripción del laboratorio",
            },
          ]}
        >
          <TextArea
            placeholder="Descripción del laboratorio..."
            rows={4}
            maxLength={500}
          />
        </Form.Item>
        <RequiredLegend />
      </Form>
    </div>
  );
}
