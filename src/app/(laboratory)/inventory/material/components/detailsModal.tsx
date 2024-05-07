import { TMaterial } from "../../interfaces";
import NFPADiamond from "./nfpaDiamond";
import SGAClassification from "./sgaClassification";

interface IDetailsModal {
  material?: TMaterial
};

export default function DetailsModal ({
  material,
}: IDetailsModal) {
  if (typeof material === "undefined") return <></>;
  
  return (
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">{material.name} #{material.id}</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="w-full flex justify-around">
            <span className="text-yellow-600">{material.superUse && "Usar bajo supervisión"}</span>
            <span className="text-red-500">{material.sensibleMaterial && "Material Sensible"}</span>
          </div>
          <div>
            <strong>Descripción:</strong>
            <br />
            {material.description}
          </div>
          <div className="w-full grid grid-cols-2 space-y-4">
            <div className="mt-4">
              <strong>Cantidad:</strong> {material.quantity}
            </div>
            {material.presentation && <div>
              <strong>Presentación:</strong> {material.presentation}
            </div>}
            {material.brand && <div>
              <strong>Marca:</strong> {material.brand}
            </div>}
            {material.batch && <div>
              <strong>Lote:</strong> {material.batch}
            </div>}
            {material.concentration && <div>
              <strong>Concentración:</strong> {material.concentration}
            </div>}
            {material.condition && <div>
              <strong>Condición:</strong> {material.condition}
            </div>}
            {material.weight && <div>
              <strong>Peso:</strong> {material.weight}
            </div>}
            {material.capacity && <div>
              <strong>Capacidad:</strong> {material.capacity}
            </div>}
            {material.code && <div>
              <strong>Código:</strong> {material.code}
            </div>}
            {material.expirationDate && <div>
              <strong>Fecha de Vencimiento:</strong> {material.expirationDate}
            </div>}
          </div>
          <div className="w-full">
            <strong>Lugar de Almacenamiento:</strong> {material.storagePlace.description}
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
          <div>
            <strong>Clasificación NFPA:</strong>
            <NFPADiamond nfpaData={material.nfpaClassif} />
          </div>
          {material.sgaClassif && material.sgaClassif.length > 0 && (
            <SGAClassification sgaClassif={material.sgaClassif} />
          )}
        </div>
      </div>
    </div>
  );
};