import { useEffect } from "react";
import { TMaterial } from "../../interfaces";
import useMaterialInit from "../hooks/useMaterialInit";

interface IDetailsModal {
  material?: TMaterial
};

export default function DetailsModal ({
  material,
}: IDetailsModal) {
  const { sgaClassification } = useMaterialInit();

  console.log("Material", material)

  if (typeof material === "undefined") return <></>;
  
  return (
    <div className="mx-auto p-4">
      <div>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">{material.name}</h2>
        </div>
        <ul className="p-4 space-y-4">
          <li className="w-full flex justify-around">
            <span>{material.superUse && "Usar bajo supervisión"}</span>
            <span>{material.sensibleMaterial && "Material Sensible"}</span>
          </li>
          <li>
            <strong>Descripción:</strong>
            <br />
            {material.description}
          </li>
          <li>
            <strong>Cantidad:</strong> {material.quantity}
          </li>
          {material.presentation && !material.presentation.includes("null") && 
            <li><strong>Presentación:</strong> {material.presentation}</li>
          }
          {material.brand && <li><strong>Marca:</strong> {material.brand}</li>}
          {material.batch && <li><strong>Lote:</strong> {material.batch}</li>}
          {material.concentration && <li><strong>Concentración:</strong> {material.concentration}</li>}
          {material.condition && <li><strong>Condición:</strong> {material.condition}</li>}
          {material.weight && <li><strong>Peso:</strong> {material.weight}</li>}
          {material.capacity && !material.capacity.includes("null") &&
            <li><strong>Capacidad:</strong> {material.capacity}</li>
          }
          {material.code && <li><strong>Código:</strong> {material.code}</li>}
          <li><strong>Lugar de Almacenamiento:</strong> {material.storagePlace}</li>
          {material.expirationDate && (
            <li>Fecha de Vencimiento: {material.expirationDate}</li>
          )}
          {material.observations && (
            <li>
              <strong>Observaciones:</strong>
              <br />
              {material.observations}
            </li>
          )}
          {material.additionalInfo && (
            <li>
              <strong>Información Adicional:</strong>
              <br />
              {material.additionalInfo}
            </li>
          )}
          <li>
            <strong>Clasificación NFPA:</strong>
            <ul className="pl-4 space-y-1">
              <li>Azul: {material.nfpaClassif.nfpaBlue}</li>
              <li>Rojo: {material.nfpaClassif.nfpaRed}</li>
              <li>Amarillo: {material.nfpaClassif.nfpaYellow}</li>
              <li>Blanco: {material.nfpaClassif.nfpaWhite}</li>
            </ul>
          </li>
          {material.sgaClassif && material.sgaClassif.length > 0 && (
            <li>
              <strong>Clasificación SGA:</strong>
              <ul className="pl-4 space-y-1">
                {material.sgaClassif.map((classification) => {
                  const sgaData = sgaClassification.find(sga => String(sga.id) === classification?.idSgaClassif);
                  return (
                    <li key={`sga-${classification?.idSgaClassif}`}>
                      {sgaData?.description}
                    </li>
                )})}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};