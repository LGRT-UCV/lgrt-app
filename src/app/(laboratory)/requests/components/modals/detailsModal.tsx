import { Button, Input, InputNumber, Tag } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  RequestStatus,
  TRequestReturnedMaterials,
  type IRequest,
  type TRequestStatus,
  type TUpdateRequestStatus,
} from "../../interfaces";
import React, { useEffect, useMemo, useState } from "react";
import {
  requestStatus,
  getStatus,
  updateRequestStatus,
  updateRequest,
} from "../../utils";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";
import { getMaterial } from "@/(laboratory)/inventory/utils";
import TextArea from "antd/es/input/TextArea";
import { Roles } from "@/lib/constants";
import { getUserRole } from "@/(laboratory)/admin/users/utils";
import { useLabProvider } from "@/context/labProvider";

interface IDetailsModal {
  request?: IRequest;
  closeModal: () => void;
}

export default function DetailsModal({ request, closeModal }: IDetailsModal) {
  const { role } = useLabProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<string>("");
  const [requesterReturn, setRequesterReturn] = useState<string>("");
  const [returnedMaterials, setReturnedMaterials] = useState<
    Array<TRequestReturnedMaterials>
  >([]);
  const [currentMaterials, setCurrentMaterials] = useState<Array<TMaterial>>(
    [],
  );
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  if (typeof request === "undefined") return <></>;

  const { currentUser, isRequester, userRole } = useMemo(() => {
    const user = sessionData?.user.user;
    const role = getUserRole(Number(user?.idRoleId)).roleName;
    return {
      currentUser: sessionData?.user.user,
      isRequester: request.idRequester.id === user?.id,
      userRole: role,
    };
  }, [sessionData?.user.user]);

  const { status, statusColor } = useMemo(() => {
    return getStatus(request.status);
  }, [request.status]);

  const nextStatus = useMemo(() => {
    const currentStatus = requestStatus.find(
      (sts) => sts.value === request.status,
    );
    if (typeof currentStatus === "undefined") return requestStatus[0];

    switch (currentStatus.value) {
      case RequestStatus.Pending:
        return (
          requestStatus.find((sts) => sts.value === RequestStatus.Approved) ??
          requestStatus[0]
        );
      case RequestStatus.Approved:
        return (
          requestStatus.find((sts) => sts.value === RequestStatus.Delivered) ??
          requestStatus[0]
        );
      case RequestStatus.Delivered:
        return (
          requestStatus.find((sts) => sts.value === RequestStatus.Returned) ??
          requestStatus[0]
        );
      default:
        return requestStatus[0];
    }
  }, [request.status]);

  const messageForRequester = useMemo(() => {
    switch (request.status) {
      case RequestStatus.Delivered:
        return "Coloca un comentario del estado en el que recibiste el material";
      case RequestStatus.Returned:
        return "Coloca un comentario del estado en el que devolviste el material";
      default:
        return "";
    }
  }, [request.status]);

  useEffect(() => {
    if (typeof request === "undefined") {
      openNotification(
        "error",
        "Ha ocurrido un error al obtener la solicitud",
        "No se está obteniendo correctamente la solicitud",
        "topRight",
      );
      closeModal();
      return;
    }

    const getMaterials = async () => {
      setIsLoading(true);
      try {
        const materials: Array<TMaterial> = [];
        const sessionToken = sessionData?.user.token ?? "";
        for (const material of request.materialRequestMaterial) {
          const materialData = await getMaterial(
            sessionToken,
            material.idMaterial,
          );
          materials.push({
            ...materialData,
            quantity: material.quantity.toString(),
          });
        }
        setCurrentMaterials([...materials]);
      } catch (error) {
        if (
          (error as Error).message.includes(
            "User is not authorized to view this material",
          )
        ) {
          openNotification(
            "error",
            "Ha ocurrido un error al obtener los materiales",
            "No tienes permisos para ver esta solicitud",
            "topRight",
          );
          closeModal();
        }
      } finally {
        setIsLoading(false);
      }
    };

    void getMaterials();
  }, [request.materialRequestMaterial, sessionData?.user.token]);

  const onChangeStatus = async (newStatus?: TRequestStatus) => {
    try {
      const statusToSave = newStatus ?? nextStatus;
      const sessionToken = sessionData?.user.token ?? "";
      const data: TUpdateRequestStatus = {
        status: isRequester ? undefined : statusToSave?.value,
      };

      if (isRequester) {
        switch (statusToSave?.value) {
          case RequestStatus.Returned:
            data.commentsRequester = comments;
            break;
          case RequestStatus.Pending:
            data.commentsRequesterReturn = comments;
            break;
        }
      } else {
        switch (request.status) {
          case RequestStatus.Approved:
            data.commentsResponsible = comments;
            break;
          case RequestStatus.Delivered:
            data.commentsResponsibleReturn = comments;
            data.materialRequestMaterial = returnedMaterials;
            if (!requesterReturn)
              throw new Error(
                "No se ha seleccionado persona que devolvió los materiales",
              );
            data.requesterReturn = requesterReturn;
            break;
        }
      }

      if (isRequester) {
        await updateRequest(request.id, data, sessionToken);
      } else {
        await updateRequestStatus(request.id, data, sessionToken);
      }
      setComments("");
      openNotification(
        "success",
        "Solicitud actualizada con éxito",
        isRequester
          ? "Su comentario ha sido enviado"
          : `El estado de la solicitud ha sido actualizada con éxito.`,
        "topRight",
      );
      closeModal();
    } catch (error) {
      if ((error as Error).message.includes("No se ha seleccionado persona")) {
        openNotification(
          "error",
          "Error al guardar el proyecto",
          "Se debe seleccionar la persona que devolvió los materiales",
          "topRight",
        );
      } else {
        openNotification(
          "error",
          "Error al guardar el proyecto",
          "Ha ocurrido un error al cambiar el status del proyecto",
          "topRight",
        );
        console.error("ERROR: ", error);
      }
    }
  };

  const handleReturnMaterial = (material: TMaterial, quantity: number = 0) => {
    setReturnedMaterials((prev) => {
      const materialIndex = prev.findIndex(
        (mat) => mat.idMaterial === material.id,
      );
      if (materialIndex === -1) {
        return [
          ...prev,
          {
            idMaterial: material.id,
            quantity: quantity.toString(),
          },
        ];
      }
      const newMaterials = [...prev];
      if (typeof newMaterials[materialIndex] !== "undefined") {
        (newMaterials[materialIndex] as TRequestReturnedMaterials).quantity =
          quantity.toString();
      }

      return newMaterials;
    });
  };

  if (isLoading)
    return (
      <div className="w-full pt-4 text-center">
        <LoadingOutlined className="text-3xl" />
      </div>
    );

  return (
    <>
      {notificationElement}
      <div className="mx-auto max-h-[calc(100vh-200px)] overflow-auto p-4">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold">Solicitud #{request.id}</h2>
          <Tag color={statusColor}>{status}</Tag>
        </div>
        <div className="p-4">
          <p className="w-full">
            <strong>Nombre del solicitante:</strong>{" "}
            {`${request.idRequester.name} ${request.idRequester.lastName}`}
          </p>

          <p className="mt-4 w-full">
            <strong>Correo:</strong> {request.idRequester.id}
          </p>

          <p className="mt-4 w-full">
            <strong>Fecha de solicitud:</strong>{" "}
            {new Date(request.datecre).toLocaleDateString("es-VE")}
          </p>

          <div className="mt-4 flex w-full flex-col gap-2">
            <strong>Materiales:</strong>
            {currentMaterials.map((material, index) => (
              <div
                key={`material-${index}`}
                className="grid w-full grid-cols-2"
              >
                <p>{material.name}</p>
                <p>
                  {material.quantity}
                  {Number(material.materialType.id) !== 2
                    ? material.measurement.name
                    : ""}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-4 mt-4 grid w-full">
            {!!request.idResponsibleDrop && (
              <div className="flex gap-2">
                <p className="mt-4 w-full">
                  <strong>Entregado por:</strong>{" "}
                  {`${request.idResponsibleDrop.name} ${request.idResponsibleDrop.lastName}`}
                </p>
                <p className="mt-4 w-full">
                  <strong>Fecha de entrega:</strong>{" "}
                  {new Date(request.dropDate).toLocaleDateString("es-VE")}
                </p>
              </div>
            )}

            {!!request.idResponsibleReturn && (
              <div className="flex gap-2">
                <p className="mt-4 w-full">
                  <strong>Recibido por:</strong>{" "}
                  {`${request.idResponsibleReturn.name} ${request.idResponsibleReturn.lastName}`}
                </p>
                <p className="mt-4 w-full">
                  <strong>Fecha de retorno:</strong>{" "}
                  {new Date(request.returnDate).toLocaleDateString("es-VE")}
                </p>
              </div>
            )}

            {!!request.requesterReturn && (
              <div className="flex gap-2">
                <p className="mt-4 w-full">
                  <strong>Recibido por:</strong> {request.requesterReturn}
                </p>
              </div>
            )}
          </div>

          <div className="mb-4 mt-8 w-full space-y-4">
            {!!request.commentsResponsible && (
              <div className="w-full">
                <strong>
                  Comentarios del responsable de entregar el material:
                </strong>
                <br />
                <p>{request.commentsResponsible ?? "Sin comentarios"}</p>
              </div>
            )}

            {!!request.commentsRequester && (
              <div className="w-full">
                <strong>
                  Comentarios del solicitante al recibir el material:
                </strong>
                <br />
                <p>{request.commentsRequester}</p>
              </div>
            )}

            {!!request.commentsRequesterReturn && (
              <div className="w-full">
                <strong>
                  Comentarios del solicitante al devolver el material:
                </strong>
                <br />
                <p>{request.commentsRequesterReturn}</p>
              </div>
            )}

            {!!request.commentsResponsibleReturn && (
              <div className="w-full">
                <strong>
                  Comentarios de la persona que recibió el material:
                </strong>
                <br />
                <p>{request.commentsResponsibleReturn}</p>
              </div>
            )}
          </div>

          {((isRequester &&
            ![RequestStatus.Pending, RequestStatus.Approved].includes(
              request.status,
            ) &&
            (!request.commentsRequester || !request.commentsRequesterReturn)) ||
            [Roles.Admin, Roles.PersonalExtra, Roles.Personal].includes(
              userRole,
            )) &&
            nextStatus?.value !== RequestStatus.Pending && (
              <div className="mt-8 flex w-full flex-col gap-1">
                <p className="mb-4 text-center text-xl font-bold">
                  {isRequester ? "Deja tu comentario" : "Cambiar estado"}:
                </p>
                {isRequester && (
                  <p className="text-xs">{messageForRequester}</p>
                )}
                <div className="w-full space-y-4">
                  {![RequestStatus.Pending, RequestStatus.Rejected].includes(
                    request.status,
                  ) && (
                    <>
                      {request.status === RequestStatus.Delivered &&
                        role !== Roles.External &&
                        !isRequester && (
                          <div className="space-y-4">
                            <p className="text-base font-bold">
                              Materiales devueltos:
                            </p>
                            {currentMaterials.map((material, index) => (
                              <div
                                key={`material-${index}`}
                                className="grid w-full grid-cols-2 items-center justify-center space-y-2"
                              >
                                <p className="font-semibold">{material.name}</p>
                                <InputNumber
                                  className="w-full"
                                  placeholder="Cantidad devuelta"
                                  min={0}
                                  defaultValue={0}
                                  onChange={(value) =>
                                    handleReturnMaterial(material, value ?? 0)
                                  }
                                  decimalSeparator=","
                                  suffix={
                                    Number(material.materialType.id) !== 2
                                      ? material.measurement.name
                                      : undefined
                                  }
                                />
                              </div>
                            ))}
                            <p className="text-base font-bold">
                              Persona que devolvió los materiales
                            </p>
                            <Input
                              placeholder="Nombre"
                              onChange={(e) =>
                                setRequesterReturn(e.target.value)
                              }
                              maxLength={120}
                            />
                          </div>
                        )}

                      <p className="text-base font-bold">Comentarios:</p>
                      <TextArea
                        placeholder={"Comentarios"}
                        rows={4}
                        maxLength={500}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </>
                  )}
                  <div
                    className={`flex w-full gap-4 ${request.status !== RequestStatus.Pending ? "justify-end" : "justify-center"}`}
                  >
                    <Button
                      className="border-none !bg-green-500 !text-white hover:!bg-green-400"
                      onClick={() => onChangeStatus()}
                    >
                      {isRequester
                        ? "Enviar"
                        : nextStatus?.value === RequestStatus.Approved
                          ? "Aprobar"
                          : nextStatus?.label ?? "Pendiente"}
                    </Button>
                    {request.status === RequestStatus.Pending &&
                      currentUser?.id !== request.idRequester.id && (
                        <Button
                          className="border-none !bg-red-500 !text-white hover:!bg-red-400"
                          onClick={() => onChangeStatus(requestStatus[1])}
                        >
                          Rechazar
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
