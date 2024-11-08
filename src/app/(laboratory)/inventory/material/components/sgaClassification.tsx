import Image from "next/image";
import { Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useMaterialInit from "../hooks/useMaterialInit";
import { IMaterial } from "../../interfaces";

export default function SGAClassification({
  sgaClassif,
}: {
  sgaClassif: IMaterial["sgaClassif"];
}) {
  const { sgaClassification, isLoading } = useMaterialInit([
    "sgaClassification",
  ]);

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <div>
      <strong>Clasificación SGA:</strong>
      <div className="grid grid-cols-2 space-y-1 pl-4">
        {sgaClassif.map((classification, index) => {
          const sgaData = sgaClassification.find(
            (sga) => String(sga.id) === classification?.idSgaClassif,
          );

          if (!!sgaData?.iconImage) {
            return (
              <Tooltip
                key={`sga-${sgaData?.id}`}
                title={sgaData.name}
                placement="right"
              >
                <Image
                  src={`data:image/png;base64,${sgaData?.iconImage}`}
                  alt={sgaData?.name ?? ""}
                  width={80}
                  height={80}
                  className="mx-auto"
                />
              </Tooltip>
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
}
