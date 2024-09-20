import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteMaterialType, getAllMaterialTypes } from "../utils";
import type { IMaterialType } from "../interfaces";

export default function useMaterialType() {
  const [searchValue, setSearchValue] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentMaterialType, setCurrentMaterialType] =
    useState<IMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const {
    data: materialTypeList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["materialType"],
    queryFn: async () => {
      try {
        return await getAllMaterialTypes(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los tipos de materiales",
          "",
          "topRight",
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateMaterialType = () => {
    setOpenCreateModal(false);
    void refetch();
  };

  const handleDeleteMaterialType = async (materialType?: IMaterialType) => {
    if (typeof materialType === "undefined") {
      openNotification(
        "error",
        "No se ha seleccionado un tipo de material a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      if (Number(materialType.existentMaterials) <= 1)
        throw new Error("MaterialType place is in use");
      await deleteMaterialType(sessionData?.user.token ?? "", materialType.id);
      void refetch();
      setCurrentMaterialType(undefined);
      openNotification(
        "success",
        "Tipo de material eliminado",
        `Se ha eliminado el tipo de material ${materialType.name}`,
        "topRight",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error", error);
      if ((error as Error).message.includes("MaterialType place is in use")) {
        openNotification(
          "error",
          "Error al eliminar el tipo de material",
          "El tipo de material se encuentra en uso",
          "topRight",
        );
      } else {
        openNotification(
          "error",
          "Ha ocurrido un error al eliminar el tipo de material",
          "",
          "topRight",
        );
      }
    }
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    const laboratories = materialTypeList.filter((materialType) => {
      return (
        materialType.id
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
        materialType.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase())
      );
    });
    return (
      laboratories.map((materialType, index) => ({
        ...materialType,
        key: `materialType-${index}`,
      })) ?? []
    );
  }, [materialTypeList, searchValue]);

  return {
    openCreateModal,
    tableData,
    currentMaterialType,
    materialTypeList,
    isLoading,
    notificationElement,
    handleDeleteMaterialType,
    setOpenCreateModal,
    setSearchValue,
    handleUpdateMaterialType,
    setCurrentMaterialType,
  };
}
