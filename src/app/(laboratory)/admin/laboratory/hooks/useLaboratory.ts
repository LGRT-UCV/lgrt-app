import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteLaboratory, getAllLaboratories } from "../utils";
import type { ILaboratory } from "../interfaces";

export default function useLaboratory() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentLaboratory, setCurrentLaboratory] = useState<ILaboratory>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const {
    data: laboratoryList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["laboratory"],
    queryFn: async () => {
      try {
        return await getAllLaboratories(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los laboratorios",
          "",
          "topRight",
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateLaboratory = () => {
    setOpenCreateModal(false);
    void refetch();
  };

  const handleDeleteLaboratory = async (laboratory?: ILaboratory) => {
    if (typeof laboratory === "undefined") {
      openNotification(
        "error",
        "No se ha seleccionado un laboratorio a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      await deleteLaboratory(sessionData?.user.token ?? "", laboratory.id);
      void refetch();
      setCurrentLaboratory(undefined);
      setOpenDetailsModal(false);
      openNotification(
        "success",
        "Laboratorio eliminado",
        `Se ha eliminado el laboratorio ${laboratory.name}`,
        "topRight",
      );
    } catch (error) {
      console.error("Error", error);
      openNotification(
        "error",
        "Ha ocurrido un error al eliminar el laboratorio",
        "Es posible que existan usuarios ya registrados en este laboratorio",
        "topRight",
      );
    }
  };

  const handleLaboratoryDetails = (laboratory?: ILaboratory, show = true) => {
    setCurrentLaboratory(laboratory);
    setOpenDetailsModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    const laboratories = laboratoryList.filter((laboratory) => {
      return (
        laboratory.id
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
        laboratory.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
        laboratory.description
          ?.toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
        laboratory.area
          ?.toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      );
    });
    return (
      laboratories.map((laboratory, index) => ({
        ...laboratory,
        key: `laboratory-${index}`,
      })) ?? []
    );
  }, [laboratoryList, searchValue]);

  return {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentLaboratory,
    laboratoryList,
    isLoading,
    notificationElement,
    handleDeleteLaboratory,
    handleLaboratoryDetails,
    setOpenCreateModal,
    setOpenDetailsModal,
    setSearchValue,
    handleUpdateLaboratory,
    setCurrentLaboratory,
  };
}
