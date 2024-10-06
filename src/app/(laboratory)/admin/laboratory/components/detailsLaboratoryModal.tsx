import React from "react";
import { ILaboratory } from "../interfaces";

interface IDetailsModal {
  laboratory?: ILaboratory;
}

export default function DetailsModal({ laboratory }: IDetailsModal) {
  if (typeof laboratory === "undefined") return <></>;

  return (
    <>
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">{laboratory.name}</h2>
        </div>
        <div className="p-4">
          <p className="w-full">
            <strong>Nombre del laboratorio:</strong> {laboratory.name}
          </p>

          <p className="my-4 w-full">
            <strong>Area:</strong> {laboratory.area}
          </p>

          <div className="w-full">
            <strong>Descripción:</strong>
            <br />
            <p>{laboratory.description ?? "Sin comentarios"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
