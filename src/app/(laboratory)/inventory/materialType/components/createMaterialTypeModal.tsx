import { Button, Form, Input, Select } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd/lib";
import useMaterialTypeForm from "../hooks/useMaterialTypeForm";
import { IMaterialType } from "../interfaces";
import RequiredLegend from "@/components/feedback/requiredLegend";
import TransferCustomFields from "./TransferCustomFields";
import { customFields } from "../utils";
import { Option } from "antd/es/mentions";

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
  const {
    isLoading,
    notificationElement,
    fieldType,
    tagsList,
    setFieldType,
    setTagsList,
    handleTagsChange,
    onFinish,
  } = useMaterialTypeForm(
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
    <div className="overflow-x-auto md:overflow-x-visible">
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
          <TransferCustomFields form={form} initialFields={data?.fields} />
        </Form.Item>
        <Form.List name="customFields">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="mb-4 flex flex-col items-end">
                  <div className="flex w-full gap-8">
                    <Form.Item
                      {...restField}
                      label="Tipo de campo"
                      name={[name, "fieldType"]}
                      className="mb-0 w-1/2 md:w-1/4"
                      shouldUpdate
                      rules={[
                        {
                          required: true,
                          message: "Por favor elija un material",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Tipo de campo"
                        onChange={(value) => {
                          if (name >= fieldType.length) {
                            setFieldType([...fieldType, value]);
                          } else {
                            setFieldType(
                              fieldType.map((type, index) =>
                                index === name ? value : type,
                              ),
                            );
                          }
                        }}
                        options={customFields.map((fields) => {
                          return {
                            label: fields.name,
                            value: JSON.stringify({
                              key: fields.key,
                              fieldType: fields.fieldType,
                            }),
                          };
                        })}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      label="Nombre del campo"
                      name={[name, "name"]}
                      className="mb-0 w-1/2 md:w-3/4"
                      rules={[
                        {
                          required: true,
                          max: 60,
                          message: "Por favor verifique el nombre del campo",
                        },
                      ]}
                    >
                      <Input
                        className="w-full"
                        placeholder="Nombre del campo"
                        maxLength={60}
                      />
                    </Form.Item>
                    {fieldType[name] &&
                      JSON.parse(fieldType[name]).fieldType === "list" && (
                        <Form.Item
                          {...restField}
                          label="Valores de la lista"
                          name={[name, "fieldList"]}
                          className="mb-0 w-1/2"
                          shouldUpdate
                          rules={[
                            {
                              required: true,
                              message:
                                "Por favor coloque los valores de la lista",
                            },
                          ]}
                        >
                          <Select
                            mode="tags"
                            style={{ width: "100%" }}
                            placeholder="Coloque los valores separados por coma (,)"
                            onChange={(value) => handleTagsChange(name, value)}
                            tokenSeparators={[",", ";"]}
                          >
                            {tagsList[name]?.map((tag) => (
                              <Option key={tag} value={tag}>
                                {tag}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}

                    <MinusCircleOutlined
                      onClick={() => {
                        setFieldType(
                          fieldType.filter((_, index) => index !== name),
                        );
                        setTagsList(
                          tagsList.filter((_, index) => index !== name),
                        );
                        remove(name);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Campo personalizado
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      <RequiredLegend />
    </div>
  );
}
