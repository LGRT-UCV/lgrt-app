import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteStorage, getAllStorages } from "../utils";
import type { IStorage } from "../interfaces";

export default function useStorage() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentStorage, setCurrentStorage] = useState<IStorage>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const {
    data: storageList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["storage"],
    queryFn: async () => {
      try {
        return await getAllStorages(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los almacenamientos",
          "",
          "topRight",
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateStorage = () => {
    setOpenCreateModal(false);
    void refetch();
  };

  const handleDeleteStorage = async (storage?: IStorage) => {
    if (typeof storage === "undefined") {
      openNotification(
        "error",
        "No se ha seleccionado un almacenamiento a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      await deleteStorage(sessionData?.user.token ?? "", storage.id);
      void refetch();
      setCurrentStorage(undefined);
      setOpenDetailsModal(false);
      openNotification(
        "success",
        "Almacenamiento eliminado",
        `Se ha eliminado el almacenamiento ${storage.name}`,
        "topRight",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error", error);
      if ((error as Error).message.includes("Storage place is in use")) {
        openNotification(
          "error",
          "Error al eliminar el almacenamiento",
          "El almacenamiento se encuentra en uso",
          "topRight",
        );
      } else {
        openNotification(
          "error",
          "Ha ocurrido un error al eliminar el almacenamiento",
          "",
          "topRight",
        );
      }
    }
  };

  const handleStorageDetails = (storage?: IStorage, show = true) => {
    setCurrentStorage(storage);
    setOpenDetailsModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    const laboratories = storageList.filter((storage) => {
      return (
        storage.id
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
        storage.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
        storage.description
          ?.toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      );
    });
    return (
      laboratories
        .map((storage, index) => ({
          ...storage,
          key: `storage-${index}`,
        }))
        .reverse() ?? []
    );
  }, [storageList, searchValue]);

  return {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentStorage,
    storageList,
    isLoading,
    notificationElement,
    handleDeleteStorage,
    handleStorageDetails,
    setOpenCreateModal,
    setOpenDetailsModal,
    setSearchValue,
    handleUpdateStorage,
    setCurrentStorage,
  };
}
