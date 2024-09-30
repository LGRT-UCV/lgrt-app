import React from "react";
import { IStorage } from "../interfaces";

interface IDetailsModal {
  storage?: IStorage;
}

export default function DetailsModal({ storage }: IDetailsModal) {
  if (typeof storage === "undefined") return <></>;

  return (
    <>
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">{storage.name}</h2>
        </div>
        <div className="space-y-4 p-4">
          <p className="w-full">
            <strong>Nombre del Almacenamiento:</strong> {storage.name}
          </p>

          <div className="w-full">
            <strong>Descripción:</strong>
            <br />
            <p>{storage.description ?? "Sin comentarios"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
