import Image from "next/image";
import useMaterialInit from "../hooks/useMaterialInit";
import { IMaterial } from "../../interfaces";

export default function SGAClassification ({ sgaClassif }: { sgaClassif: IMaterial["sgaClassif"] }) {
  const { sgaClassification } = useMaterialInit();

  return (
    <div>
      <strong>Clasificación SGA:</strong>
      <div className="pl-4 space-y-1 grid grid-cols-2">
        {sgaClassif.map((classification, index) => {
          const sgaData = sgaClassification.find(sga => String(sga.id) === classification?.idSgaClassif);

          if (!!sgaData?.iconImage) {
            return (
              <Image
                key={`sga-${sgaData?.id}`}
                src={`data:image/png;base64,${sgaData?.iconImage}`}
                alt={sgaData?.name ?? ""}
                width={80}
                height={80}
                className="mx-auto"
              />
            );
          } else {
            return (
              <div
                key={`sga-${classification?.idSgaClassif}`}
                className={index === 0 ? "mt-1" : ""}
              >
                {sgaData?.description}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};