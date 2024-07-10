import { ILaboratory } from "../interfaces";

interface IDetailsModal {
  laboratory?: ILaboratory;
};

export default function DetailsModal ({ laboratory }: IDetailsModal) {

  if (typeof laboratory === "undefined") return <></>;
  
  return (<>
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">{laboratory.name}</h2>
      </div>
      <div className="p-4">
        <p className="w-full">
          <strong>Nombre del laboratorio:</strong> {laboratory.name}
        </p>

        <p className="w-full my-4">
          <strong>Area:</strong> {laboratory.area}
        </p>

        <div className="w-full">
          <strong>Descripción:</strong>
          <br />
          <p>{laboratory.description ?? "Sin comentarios"}</p>
        </div>
      </div>
    </div>
  </>);
};