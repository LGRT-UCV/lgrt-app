import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteRequest, getAllRequests } from "./utils";
import type { IRequest } from "./interfaces";

export default function useRequest () {
  const [searchValue, setSearchValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<IRequest>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const { data: requestList= [], isLoading, refetch } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      try {
        return await getAllRequests(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener las solicitudes",
          "",
          "topRight"
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateRequest = () => {
    setOpenModal(false);
    void refetch();
  };

  const handleDeleteRequest = async (request?: IRequest) => {
    if (typeof request === "undefined") {
      openNotification("error", "No se ha seleccionado solicitud a eliminar", "", "topRight");
      return;
    }
  
    try {
      await deleteRequest(
        sessionData?.user.token ?? "",
        request.id
      );
      void refetch();
      setCurrentRequest(undefined);
      setOpenModal(false);
      openNotification(
        "success",
        "Material eliminado",
        `Se ha eliminado la solicitud ${request.id}`,
        "topRight"
      );
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al eliminar la solicitud", "", "topRight");
    }
  };

  const handleRequestDetails = (request?: IRequest, show = true) => {
    setCurrentRequest(request)
    setOpenModal(show);
  };

  const handleRequestMaterials = (request?: IRequest) => {
    
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    return requestList.map((request, index) => ({
      ...request,
      key: `request-${index}`,
      dropDate: new Date(request.dropDate).toLocaleDateString('es-VE'),
    })) ?? [];
  }, [requestList, searchValue]);

  return {
    openModal,
    tableData,
    currentRequest,
    requestList,
    isLoading,
    notificationElement,
    handleDeleteRequest,
    handleRequestDetails,
    setOpenModal,
    setSearchValue,
    handleUpdateRequest,
    handleRequestMaterials,
  };
};