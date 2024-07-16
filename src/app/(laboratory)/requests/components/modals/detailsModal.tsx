import { Button, Select, Tag } from "antd";
import { RequestStatus, type IRequest, type TRequestStatus, type TStatus, type TUpdateRequestStatus } from "../../interfaces";
import { useEffect, useMemo, useState } from "react";
import { SelectProps } from "antd/lib";
import { requestStatus, getStatus, updateRequestStatus } from "../../utils";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";
import TextArea from "antd/es/input/TextArea";

type TagRender = SelectProps["tagRender"];

interface IDetailsModal {
  request?: IRequest;
  closeModal: () => void;
};

export default function DetailsModal ({
  request,
  closeModal,
}: IDetailsModal) {
  const [comments, setComments] = useState<string>("");
  const [currentMaterials, setCurrentMaterials] = useState<Array<TMaterial>>([]);
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  if (typeof request === "undefined") return <></>;

  const { status, statusColor } = useMemo(() => {
    return getStatus(request.status);
  }, [request.status]);

  const nextStatus = useMemo(() => {
    const currentStatus = requestStatus.find(sts => sts.value === request.status);
    if (typeof currentStatus === "undefined") return requestStatus[0];

    switch (currentStatus.value) {
      case "P":
        return requestStatus.find(sts => sts.value === "A") ?? requestStatus[0];
      case "A":
        return requestStatus.find(sts => sts.value === "E") ?? requestStatus[0];
      case "E":
        return requestStatus.find(sts => sts.value === "D") ?? requestStatus[0];
      default:
        return requestStatus[0];
    }
  }, [request.status]);

  useEffect(() => {
    const getMaterials = async () => {
      const materials: Array<TMaterial> = [];
      const sessionToken = sessionData?.user.token ?? "";
      for (const material of request.materialRequestMaterial) {
        const materialData = await getMaterial(sessionToken, material.idMaterial);
        materials.push({ ...materialData, quantity: material.quantity.toString() });
      }
      setCurrentMaterials([...materials]);
    };

    void getMaterials();
  }, []);

  const onChangeStatus = async (newStatus?: TRequestStatus) => {
    try {
      const statusToSave = newStatus ?? nextStatus;
      const sessionToken = sessionData?.user.token ?? "";
      const data: TUpdateRequestStatus = {
        status: statusToSave?.value,
        commentsResponsible: request.status === "P" ? comments : undefined,
        commentsResponsibleReturn: request.status === "E" ? comments : undefined,
      };
      await updateRequestStatus(request.id, data, sessionToken);
      openNotification(
        "success",
        "Solicitud actualizada con exito",
        `El status ${statusToSave?.label} ha sido guardado con exito.`,
        "topRight"
      );
      closeModal();
    } catch (error) {
      openNotification(
        "error",
        "Error al guardar el proyecto",
        "Ha ocurrido un error al cambiar el status del proyecto",
        "topRight"
      );
      console.log("ERROR: ", error);
    }
  };
  
  return (<>
    {notificationElement}
    <div className="mx-auto p-4 max-h-[calc(100vh-200px)] overflow-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">Solicitud #{request.id}</h2>
        <Tag color={statusColor}>
          {status}
        </Tag>
      </div>
      <div className="p-4">
        <p className="w-full">
          <strong>Nombre del solicitante:</strong> {`${request.idRequester.name} ${request.idRequester.lastName}`}
        </p>

        <p className="w-full mt-4">
          <strong>Correo:</strong> {request.idRequester.id}
        </p>

        <p className="w-full mt-4">
          <strong>Fecha de solicitud:</strong> {new Date(request.datecre).toLocaleDateString('es-VE')}
        </p>

        <div className="w-full flex flex-col gap-2 mt-4">
          <strong>Materiales:</strong>
          {currentMaterials.map((material, index) => (
            <div key={`material-${index}`} className="w-full grid grid-cols-2">
              <p>
                {material.name}
              </p>
              <p>
                {material.quantity}{material.measurement.name}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full grid grid-cols-2 space-y-4 mt-4">
          {!!request.idResponsibleDrop && (
            <div>
              <p className="mt-4">
                <strong>Entregado por:</strong> {`${request.idResponsibleDrop.name} ${request.idResponsibleDrop.lastName}`}
              </p>
              <p className="w-full mt-4">
                <strong>Fecha de entrega:</strong> {new Date(request.dropDate).toLocaleDateString('es-VE')}
              </p>
            </div>
          )}

          {!!request.idResponsibleReturn && (
            <div>
              <p className="mt-4">
                <strong>Recibido por:</strong> {`${request.idResponsibleReturn.name} ${request.idResponsibleReturn.lastName}`}
              </p>
              <p className="w-full mt-4">
                <strong>Fecha de retorno:</strong> {new Date(request.returnDate).toLocaleDateString('es-VE')}
              </p>
            </div>
          )}
        </div>

        <div className="w-full space-y-4 mb-4">
          {!!request.commentsResponsible && <div className="w-full">
            <strong>Comentarios del responsable de entregar el material:</strong>
            <br />
            <p>{request.commentsResponsible ?? "Sin comentarios"}</p>
          </div>}

          {!!request.commentsRequester && <div className="w-full">
            <strong>Comentarios del solicitante al recibir el material:</strong>
            <br />
            <p>{request.commentsRequester}</p>
          </div>}

          {!!request.commentsRequester && <div className="w-full">
            <strong>Comentarios de la persona que recibió el material:</strong>
            <br />
            <p>{request.commentsRequester}</p>
          </div>}
        </div>

        {(request.idRequester.id !== sessionData?.user.user.id || request.status === RequestStatus.Delivered) && (
          <div className="w-full flex flex-col gap-1">
            <strong>Cambiar status:</strong>
            <div className="w-full space-y-4">
              {![RequestStatus.Pending, RequestStatus.Returned].includes(request.status) &&
                <TextArea placeholder={"Comentarios"} rows={4} maxLength={500} value={comments} onChange={(e) => setComments(e.target.value)}/>
              }
              <Button className="bg-green-500 !text-white mr-4 hover:!bg-green-400 border-none" onClick={() => onChangeStatus()}>
                Cambiar a {nextStatus?.label ?? "Pendiente"}
              </Button>
              {request.status === RequestStatus.Pending &&
                <Button className="bg-red-500 hover:!bg-red-400 !text-white border-none" onClick={() => onChangeStatus(requestStatus[1])}>
                  Rechazar
                </Button>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  </>);
};