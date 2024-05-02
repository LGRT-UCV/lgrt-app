import { IMaterial } from "../../interfaces";

export default function NFPADiamond({ nfpaData }: { nfpaData: IMaterial["nfpaClassif"] }) {
  return (
    <div className="text-2xl py-4">      
      <div className="relative w-full h-48 mt-8">
        {/* diamond red */}
        <div
          className="w-24 h-24 bg-red-500 border border-black flex justify-center items-center absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-45"
        >
          <span className="rotate-45 pb-4">{nfpaData.nfpaRed}</span>
        </div>
        {/* diamond yellow */}
        <div
          className="w-24 h-24 bg-yellow-500 border border-black flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-y-1/2 -rotate-45"
        >
          <span className="rotate-45 pb-4">{nfpaData.nfpaYellow}</span>
        </div>
        {/* diamond blue */}
        <div
          className="w-24 h-24 bg-blue-500 border border-black flex justify-center items-center absolute top-1/2 right-1/2 transform -translate-y-1/2 -rotate-45"
        >
          <span className="rotate-45 pb-4">{nfpaData.nfpaBlue}</span>
        </div>
        {/* diamond white */}
        <div
          className="w-24 h-24 bg-white border border-black flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -rotate-45"
        >
          <span className="rotate-45">{nfpaData.nfpaWhite}</span>
        </div>
      </div>
    </div>
  );
};
