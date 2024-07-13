import { IStorage } from "../interfaces";

interface IDetailsModal {
  storage?: IStorage;
};

export default function DetailsModal ({ storage }: IDetailsModal) {

  if (typeof storage === "undefined") return <></>;
  
  return (<>
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">{storage.name}</h2>
      </div>
      <div className="p-4 space-y-4">
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
  </>);
};