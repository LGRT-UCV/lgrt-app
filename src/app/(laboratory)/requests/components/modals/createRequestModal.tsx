import { Button, Form, InputNumber, TreeSelect } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useRequestForm from "../../hooks/useRequestForm";

export default function CreateRequestModal({
  form,
  closeModal,
}: {
  form: FormInstance;
  closeModal: () => void;
}) {
  const {
    isLoading,
    materialList,
    materialsSelected,
    measurements,
    notificationElement,
    handleMeasurements,
    onFinish,
  } = useRequestForm(() => {
    form.resetFields();
    closeModal();
  });

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <div>
      {notificationElement}
      <Form
        name="requestForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
        size="large"
        scrollToFirstError
        initialValues={{ items: [{}] }}
      >
        <Form.List name="materialRequestMaterial">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="flex w-full gap-8">
                  <Form.Item
                    {...restField}
                    label="Materiales a usar"
                    name={[name, "idMaterial"]}
                    className="mb-4 w-2/3"
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
                    className="w- mb-4"
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
      </Form>
    </div>
  );
}
