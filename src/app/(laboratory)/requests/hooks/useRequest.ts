import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteRequest, getAllRequests } from "../utils";
import { RequestStatus, type IRequest } from "../interfaces";
import { Roles } from "@/lib/constants";
import { getUserRole } from "@/(laboratory)/admin/users/utils";

export default function useRequest() {
  const [searchValue, setSearchValue] = useState("");
  const [requestStatus, setRequestStatus] = useState<string>("all");
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<IRequest>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const {
    data: requestList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        return await getAllRequests(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener las solicitudes",
          "",
          "topRight",
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const ableToDelete = useCallback(
    (request?: IRequest) => {
      const req = request ?? currentRequest;
      const currentUser = sessionData?.user.user;
      const userRole = getUserRole(Number(currentUser?.idRoleId)).roleName;
      const isUserWithPermission =
        [Roles.Admin, Roles.PersonalExtra, Roles.Personal].includes(userRole) ||
        currentUser?.id === req?.idRequester.id;
      return req?.status === RequestStatus.Pending && isUserWithPermission;
    },
    [sessionData?.user],
  );

  const handleUpdateRequest = () => {
    setOpenDetailsModal(false);
    setOpenCreateModal(false);
    void refetch();
  };

  const handleDeleteRequest = async (request?: IRequest) => {
    if (typeof request === "undefined") {
      openNotification(
        "error",
        "No se ha seleccionado solicitud a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      await deleteRequest(sessionData?.user.token ?? "", request.id);
      void refetch();
      setCurrentRequest(undefined);
      setOpenDetailsModal(false);
      openNotification(
        "success",
        "Solicitud eliminada",
        `Se ha eliminado la solicitud ${request.id}`,
        "topRight",
      );
    } catch (error) {
      openNotification(
        "error",
        "Ha ocurrido un error al eliminar la solicitud",
        "",
        "topRight",
      );
    }
  };

  const handleRequestDetails = (request?: IRequest, show = true) => {
    setCurrentRequest(request);
    setOpenDetailsModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    const search = searchValue.toLocaleLowerCase();
    const requests = requestList.filter((request) => {
      const requesterFullName = `${request.idRequester.name} ${request.idRequester.lastName}`;
      return (
        (request.id.toLocaleLowerCase().includes(search) ||
          request.idRequester.id.toLocaleLowerCase().includes(search) ||
          requesterFullName.toLocaleLowerCase().includes(search)) &&
        (requestStatus === "all" || request.status === requestStatus)
      );
    });
    return (
      requests.map((request, index) => ({
        ...request,
        key: `request-${index}`,
        requester: `${request.idRequester.name} ${request.idRequester.lastName}`,
        dateupd: new Date(
          request.dateupd ?? request.datecre,
        ).toLocaleDateString("es-VE"),
      })) ?? []
    );
  }, [requestList, searchValue, requestStatus]);

  return {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentRequest,
    requestList,
    isLoading,
    notificationElement,
    ableToDelete,
    handleDeleteRequest,
    handleRequestDetails,
    setOpenDetailsModal,
    setOpenCreateModal,
    setSearchValue,
    setRequestStatus,
    handleUpdateRequest,
  };
}
