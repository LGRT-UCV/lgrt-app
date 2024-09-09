import { DatePicker, Form, Input, Select } from "antd";
import type { TFields } from "../../materialType/interfaces";

type TCustomFields = {
  fields: Array<TFields>;
};

export default function CustomFieldsForm({ fields }: TCustomFields) {
  return (
    <div className="mt-8 flex w-full flex-wrap gap-2">
      {fields.map((field, index) => {
        switch (field.fieldType) {
          case "date":
            return (
              <Form.Item
                key={index}
                label={field.name}
                name={`custom-${field.id}`}
                className="mb-4 w-full md:w-1/4"
                rules={[
                  {
                    type: "date",
                    required: false,
                    message: "Por favor verifique la fecha",
                  },
                ]}
              >
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
            );
          case "string":
            return (
              <Form.Item
                key={index}
                label={field.name}
                name={`custom-${field.id}`}
                className="mb-4 w-full md:w-2/5"
                rules={[
                  {
                    type: "string",
                    required: false,
                    max: 120,
                    message: "Por favor verifique el campo",
                  },
                ]}
              >
                <Input placeholder={field.name} maxLength={120} />
              </Form.Item>
            );
          case "list":
            return (
              <Form.Item
                key={index}
                name={`custom-${field.id}`}
                label={field.name}
                rules={[
                  { required: false, message: "Por favor elija una opción" },
                ]}
                className={`mb-4 w-full md:w-2/5`}
              >
                <Select
                  showSearch
                  placeholder={field.name}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label?.toLowerCase() ?? "").includes(
                      input.toLowerCase(),
                    )
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={String(field.fieldList)
                    .split(";")
                    .map((fieldName) => {
                      return {
                        label: fieldName,
                        value: fieldName,
                      };
                    })}
                />
              </Form.Item>
            );
          default:
            break;
        }
      })}
    </div>
  );
}
