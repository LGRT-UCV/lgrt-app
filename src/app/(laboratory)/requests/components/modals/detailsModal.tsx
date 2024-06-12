import { Button, Select, Tag } from "antd";
import type { IRequest, TUpdateRequestStatus } from "../../interfaces";
import { useEffect, useMemo, useState } from "react";
import { SelectProps } from "antd/lib";
import { getStatus, updateRequestStatus } from "../../utils";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";

type TagRender = SelectProps["tagRender"];

interface IDetailsModal {
  request?: IRequest;
  closeModal: () => void;
};

export default function DetailsModal ({
  request,
  closeModal,
}: IDetailsModal) {
  const [statusSelected, setStatusSelected] = useState<string>();
  const [currentMaterials, setCurrentMaterials] = useState<Array<TMaterial>>([]);
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  if (typeof request === "undefined") return <></>;

  const { status, statusColor } = useMemo(() => {
    return getStatus(request.status);
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

  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
      >
        {label}
      </Tag>
    );
  };

  const onChangeStatus = async () => {
    try {
      const sessionToken = sessionData?.user.token ?? "";
      const data: TUpdateRequestStatus = {
        status: statusSelected,
      };
      await updateRequestStatus(request.id, data, sessionToken);
      openNotification(
        "success",
        "Solicitud actualizada con exito",
        `El status ${statusSelected} ha sido guardado con exito.`,
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

        <div className="w-full flex flex-col gap-1">
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

        <div className="w-full grid grid-cols-2 space-y-4">
          {!!request.idResponsibleDrop && <p className="mt-4">
            <strong>Entregado por:</strong> {`${request.idResponsibleDrop.name} ${request.idResponsibleDrop.lastName}`}
          </p>}

          {!!request.idResponsibleReturn && <p className="mt-4">
            <strong>Recibido por:</strong> {`${request.idResponsibleReturn.name} ${request.idResponsibleReturn.lastName}`}
          </p>}
        </div>

        {!!request.commentsResponsible && <div className="w-full">
          <strong>Comentarios del responsable de entregar el material:</strong>
          <br />
          <p>{request.commentsResponsible}</p>
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

        <div className="w-full flex flex-col gap-1">
          <strong>Cambiar status:</strong>
          <div className="w-full grid grid-cols-2 items-center space-x-4">
            <div className="flex gap-2 items-center">
              <Select
                tagRender={tagRender}
                defaultValue={[request.status ?? "I"]}
                onSelect={value => setStatusSelected(value)}
                style={{ width: "100%" }}
                options={[
                  {
                    label: "Aprobado",
                    value: "A",
                  },
                  {
                    label: "Pendiente",
                    value: "P",
                  },
                  {
                    label: "Rechazado",
                    value: "R",
                  },
                  {
                    label: "Entregado",
                    value: "E",
                  },
                  {
                    label: "Devuelto",
                    value: "D",
                  },
                ]}
              />
            </div>
            <Button onClick={onChangeStatus}>Cambiar</Button>
          </div>
        </div>
      </div>
    </div>
  </>);
};