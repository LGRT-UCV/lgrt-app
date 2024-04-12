import { Input, InputNumber } from "antd";
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
          <InputNumber name="nfpaRed" defaultValue={0} className="text-3xl w-12 h-12 rotate-45 bg-transparent border-none pl-1" min={0} max={4} controls={false} />
        </div>
        {/* diamond yellow */}
        <div
          className="w-24 h-24 bg-yellow-500 border border-black flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -rotate-45"
        >
          <InputNumber name="nfpaYellow" defaultValue={0} className="text-3xl w-12 h-12 rotate-45 bg-transparent border-none pl-2" min={0} max={4} controls={false} />
        </div>
        {/* diamond blue */}
        <div
          className="w-24 h-24 bg-blue-500 border border-black flex justify-center items-center absolute top-1/2 right-1/2 transform -translate-y-1/2 -rotate-45"
        >
          <InputNumber name="nfpaBlue" defaultValue={0} className="text-3xl w-12 h-12 rotate-45 bg-transparent border-none pl-0" min={0} max={4} controls={false} />
        </div>
        {/* diamond white */}
        <div
          className="w-24 h-24 bg-white border border-black flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -rotate-45"
        >
          <Input name="nfpaWhite" maxLength={30} className="text-center text-sm w-full rotate-45" />
        </div>
      </div>
    </div>
  );
};

export default NFPAForm;
