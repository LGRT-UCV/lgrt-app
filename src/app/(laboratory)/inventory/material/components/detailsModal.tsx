import { TMaterial, TMaterialType } from "../../interfaces";
import { isoDateRegex } from "../utils";
import NFPADiamond from "./nfpaDiamond";
import SGAClassification from "./sgaClassification";

interface IDetailsModal {
  material?: TMaterial;
  materialType?: TMaterialType;
}

export default function DetailsModal({
  material,
  materialType,
}: IDetailsModal) {
  if (typeof material === "undefined") return <></>;

  return (
    <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
      <div>
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">
            {material.name} #{material.id}
          </h2>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex w-full justify-around">
            <span className="text-yellow-600">
              {String(material.superUse) === "Si"
                ? "Usar bajo supervisión"
                : ""}
            </span>
            <span className="text-red-500">
              {String(material.sensibleMaterial) === "Si"
                ? "Material Sensible"
                : ""}
            </span>
          </div>
          <div>
            <strong>Descripción:</strong>
            <br />
            {material.description}
          </div>
          <div className="grid w-full grid-cols-2 space-y-4">
            <div className="mt-4">
              <strong>Cantidad:</strong> {material.quantity}
            </div>
            {material.presentation && (
              <div>
                <strong>Presentación:</strong> {material.presentation}
              </div>
            )}
            {material.brand && (
              <div>
                <strong>Marca:</strong> {material.brand}
              </div>
            )}
            {material.batch && (
              <div>
                <strong>Lote:</strong> {material.batch}
              </div>
            )}
            {material.concentration && (
              <div>
                <strong>Concentración:</strong> {material.concentration}
              </div>
            )}
            {material.condition && (
              <div>
                <strong>Condición:</strong> {material.condition}
              </div>
            )}
            {material.weight && (
              <div>
                <strong>Peso:</strong> {material.weight}
              </div>
            )}
            {material.capacity && (
              <div>
                <strong>Capacidad:</strong> {material.capacity}
              </div>
            )}
            {material.code && (
              <div>
                <strong>Código:</strong> {material.code}
              </div>
            )}
            {material.expirationDate && (
              <div>
                <strong>Fecha de Vencimiento:</strong> {material.expirationDate}
              </div>
            )}
          </div>
          <div className="w-full">
            <strong>Lugar de Almacenamiento:</strong>{" "}
            {String(material.storagePlace)}
          </div>
          {material.observations && (
            <div>
              <strong>Observaciones:</strong>
              <br />
              {material.observations}
            </div>
          )}
          {material.additionalInfo && (
            <div>
              <strong>Información Adicional:</strong>
              <br />
              {material.additionalInfo}
            </div>
          )}
          {material.customFieldValues &&
            material.customFieldValues.map((field) => {
              const value = isoDateRegex.test(field.value)
                ? new Date(field.value).toLocaleDateString("es-VE")
                : field.value;
              return (
                <div key={field.idMaterialField}>
                  <strong>
                    {
                      materialType?.customFields.find(
                        (custom) => custom.id === field.idMaterialField,
                      )?.name
                    }
                    :
                  </strong>
                  {}
                  {value}
                </div>
              );
            })}
          {material.nfpaClassif.nfpaWhite && (
            <div>
              <strong>Clasificación NFPA:</strong>
              <NFPADiamond nfpaData={material.nfpaClassif} />
            </div>
          )}
          {material.sgaClassif && material.sgaClassif.length > 0 && (
            <SGAClassification sgaClassif={material.sgaClassif} />
          )}
        </div>
      </div>
    </div>
  );
}
