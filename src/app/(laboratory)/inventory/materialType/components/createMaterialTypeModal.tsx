import { Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useMaterialTypeForm from "../hooks/useMaterialTypeForm";
import { IMaterialType } from "../interfaces";
import RequiredLegend from "@/components/feedback/requiredLegend";
import TransferCustomFields from "./TransferCustomFields";

type TCreateMaterialTypeModal = {
  form: FormInstance;
  data?: IMaterialType;
  closeModal: () => void;
};

export default function CreateMaterialTypeModal({
  form,
  data,
  closeModal,
}: TCreateMaterialTypeModal) {
  const { isLoading, notificationElement, onFinish } = useMaterialTypeForm(
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
        name="materialTypeForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        size="large"
        scrollToFirstError
        className="p-4"
      >
        <Form.Item
          label="Nombre del tipo de material"
          name="name"
          className="w-full"
          rules={[
            {
              required: true,
              type: "string",
              max: 120,
              message: "Por favor verifique el nombre del tipo de material",
            },
          ]}
        >
          <Input placeholder="Nombre del tipo de material" maxLength={120} />
        </Form.Item>
        <Form.Item
          label="Campos predefinidos"
          name="predefinedFields"
          className="w-full"
        >
          <TransferCustomFields />
        </Form.Item>
      </Form>
      <RequiredLegend />
    </div>
  );
}
