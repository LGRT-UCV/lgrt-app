import { IMaterial } from "../../interfaces";

export default function NFPADiamond({
  nfpaData,
}: {
  nfpaData: IMaterial["nfpaClassif"];
}) {
  return (
    <div className="py-4 text-2xl">
      <div className="relative mt-8 h-48 w-full">
        {/* diamond red */}
        <div className="absolute left-1/2 top-0 flex h-24 w-24 -translate-x-1/2 -rotate-45 transform items-center justify-center border border-black bg-red-500">
          <span className="rotate-45">{nfpaData.nfpaRed}</span>
        </div>
        {/* diamond yellow */}
        <div className="absolute left-[54%] top-[60%] flex h-24 w-24 -translate-y-1/2 -rotate-45 transform items-center justify-center border border-black bg-yellow-500">
          <span className="rotate-45">{nfpaData.nfpaYellow}</span>
        </div>
        {/* diamond blue */}
        <div className="absolute right-[54%] top-[60%] flex h-24 w-24 -translate-y-1/2 -rotate-45 transform items-center justify-center border border-black bg-blue-500">
          <span className="rotate-45">{nfpaData.nfpaBlue}</span>
        </div>
        {/* diamond white */}
        <div className="absolute left-1/2 top-[70%] flex h-24 w-24 -translate-x-1/2 -rotate-45 transform items-center justify-center border border-black bg-white">
          <span className="rotate-45">{nfpaData.nfpaWhite}</span>
        </div>
      </div>
    </div>
  );
}
