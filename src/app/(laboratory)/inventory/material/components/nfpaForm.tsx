import { Form, Input, InputNumber } from "antd";
import { IMaterial } from "../../interfaces";

interface INFPAForm {
  nfpaData?: IMaterial["nfpaClassif"];
  readOnly?: boolean;
}

export default function NFPAForm({ nfpaData, readOnly = false }: INFPAForm) {
  return (
    <div className="w-full md:w-1/2">
      <h5>Clasificación NFPA</h5>

      <div className="relative mt-8 h-48 w-full">
        {/* diamond red */}
        <div className="absolute left-1/2 top-0 flex h-24 w-24 -translate-x-1/2 -rotate-45 transform items-center justify-center border border-black bg-red-500">
          <Form.Item
            name="nfpaRed"
            initialValue={0}
            className="flex w-full rotate-45 justify-center pl-6"
            rules={[
              {
                type: "number",
                required: true,
                message: "",
                min: 0,
                max: 4,
              },
            ]}
          >
            <InputNumber
              className="h-12 w-12 border-none bg-transparent text-3xl"
              min={0}
              max={4}
              controls={false}
              readOnly={readOnly}
            />
          </Form.Item>
        </div>
        {/* diamond yellow */}
        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-y-1/2 -rotate-45 transform items-center justify-center border border-black bg-yellow-500">
          <Form.Item
            name="nfpaYellow"
            initialValue={0}
            className="flex w-full rotate-45 justify-center pl-6"
            rules={[
              {
                type: "number",
                required: true,
                message: "",
                min: 0,
                max: 4,
              },
            ]}
          >
            <InputNumber
              className="h-12 w-12 border-none bg-transparent pl-2 text-3xl"
              min={0}
              max={4}
              controls={false}
              readOnly={readOnly}
            />
          </Form.Item>
        </div>
        {/* diamond blue */}
        <div className="absolute right-1/2 top-1/2 flex h-24 w-24 -translate-y-1/2 -rotate-45 transform items-center justify-center border border-black bg-blue-500">
          <Form.Item
            name="nfpaBlue"
            initialValue={0}
            className="flex w-full rotate-45 justify-center pl-6"
            rules={[
              {
                type: "number",
                required: true,
                message: "",
                min: 0,
                max: 4,
              },
            ]}
          >
            <InputNumber
              className="h-12 w-12 border-none bg-transparent pl-0 text-3xl"
              min={0}
              max={4}
              controls={false}
              readOnly={readOnly}
            />
          </Form.Item>
        </div>
        {/* diamond white */}
        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -rotate-45 transform items-center justify-center border border-black bg-white">
          <Form.Item
            name="nfpaWhite"
            className="mt-6 flex w-full rotate-45 justify-center"
            rules={[
              {
                type: "string",
                required: true,
                message: "",
                max: 30,
              },
            ]}
          >
            <Input
              maxLength={30}
              readOnly={readOnly}
              className="w-full text-center text-sm font-bold"
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}
