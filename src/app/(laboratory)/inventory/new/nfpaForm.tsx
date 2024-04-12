import { Form, Input, InputNumber } from "antd";
import Title from "antd/es/typography/Title";

const NFPAForm = () => {
  return (
    <div>
      <Title level={5}>Clasificación NFPA</Title>
      
      <div className="relative w-full h-48">
        {/* diamond red */}
        <div
          className="w-24 h-24 bg-red-500 border border-black flex justify-center items-center absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-45"
        >
          <Form.Item
            name="nfpaRed"
            initialValue={0}
            className="w-full rotate-45 flex justify-center pl-6"
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
              className="text-3xl w-12 h-12 bg-transparent border-none"
              min={0}
              max={4}
              controls={false}
            />
          </Form.Item>
        </div>
        {/* diamond yellow */}
        <div
          className="w-24 h-24 bg-yellow-500 border border-black flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -rotate-45"
        >
          <Form.Item
            name="nfpaYellow"
            initialValue={0}
            className="w-full rotate-45 flex justify-center pl-6"
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
              className="text-3xl w-12 h-12 bg-transparent border-none pl-2"
              min={0}
              max={4}
              controls={false}
            />
          </Form.Item>
        </div>
        {/* diamond blue */}
        <div
          className="w-24 h-24 bg-blue-500 border border-black flex justify-center items-center absolute top-1/2 right-1/2 transform -translate-y-1/2 -rotate-45"
        >
          <Form.Item
            name="nfpaBlue"
            initialValue={0}
            className="w-full rotate-45 flex justify-center pl-6"
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
            className="text-3xl w-12 h-12 border-none bg-transparent pl-0"
            min={0}
            max={4}
            controls={false}
          />
          </Form.Item>
        </div>
        {/* diamond white */}
        <div
          className="w-24 h-24 bg-white border border-black flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -rotate-45"
        >
          <Form.Item
            name="nfpaWhite"
            className="w-full rotate-45 flex justify-center mt-6"
            rules={[
              {
                type: "string",
                required: true,
                message: "",
                max: 30,
              },
            ]}
          >
            <Input maxLength={30} className="text-center font-bold text-sm w-full" />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default NFPAForm;
