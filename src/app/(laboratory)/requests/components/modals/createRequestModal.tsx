import { Button, Form, InputNumber, TreeSelect } from "antd";
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useRequestForm from "../../hooks/useRequestForm";

export default function CreateRequestModal ({ form, closeModal } : { form : FormInstance, closeModal: () => void}) {
  const {
    isLoading,
    materialList,
    measurements,
    notificationElement,
    handleMeasurements,
    onFinish,
  } = useRequestForm(closeModal);

  if (isLoading) return (
    <div className="w-full text-center pt-4">
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
      >
        <Form.List name="materialRequestMaterial">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full flex gap-8">
                  <Form.Item
                    {...restField}
                    label="Materiales a usar"
                    name={[name, "idMaterial"]}
                    className="w-full mb-4"
                    shouldUpdate
                  >
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="Please select"
                      allowClear
                      treeData={materialList}
                      filterTreeNode={(input, option) => (String(option?.title).toLowerCase() ?? "").includes(input.toLowerCase())}
                      onSelect={(_, option) => handleMeasurements(option.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Cantiadad a user"
                    name={[name, "quantity"]}
                    className="w-full mb-4"
                    rules={[
                      {
                        required: true,
                        message: "Por favor verifique la cantidad",
                      },
                    ]}
                  >
                    <InputNumber className="w-full" placeholder="cantidad" min={0} max={100} suffix={measurements[key]} />
                  </Form.Item>
                  {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Agragar material
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

      </Form>
    </div>
  );
};