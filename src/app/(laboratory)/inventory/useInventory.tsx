import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import type { AnyObject } from "antd/es/_util/type";
import { useQuery } from "@tanstack/react-query";
import useNotification from "@/hooks/useNotification";
import useMaterialInit from "./material/hooks/useMaterialInit";
import { deleteMaterial, getAllMaterials } from "./utils";
import type { TMaterial, TMaterialType } from "./interfaces";

export default function useInventory() {
  const [openModal, setOpenModal] = useState(false);
  const { materialTypeList } = useMaterialInit(["materialType"]);
  const { openNotification, notificationElement } = useNotification();
  const [currentMaterialType, setCurrentMaterialType] =
    useState<TMaterialType>();
  const [currentMaterial, setCurrentMaterial] = useState<TMaterial>();
  const [searchValue, setSearchValue] = useState("");
  const { data: sessionData } = useSession();

  const {
    data: materialList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      try {
        return await getAllMaterials(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los materiales",
          "",
          "topRight",
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  useEffect(() => {
    if (
      typeof materialTypeList[0] === "undefined" ||
      typeof currentMaterialType !== "undefined"
    )
      return;

    setCurrentMaterialType(materialTypeList[0]);
  }, [materialTypeList, currentMaterialType]);

  const tableData: Array<AnyObject> = useMemo(() => {
    const currentMaterials = materialList.filter(
      (material) =>
        material.materialType.id === currentMaterialType?.id &&
        (material.name
          .toLocaleLowerCase()
          .includes(searchValue.toLocaleLowerCase()) ||
          material.id
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase()) ||
          material.storagePlace.name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())),
    );
    return (
      currentMaterials?.reverse().map((material, index) => ({
        ...material,
        key: `material-${index}`,
        materialType: currentMaterialType?.name,
        weight: `${material.weight} ${material.measurement.name}`,
        capacity: !!material.capacity
          ? `${material.capacity} ${material.measurement.name}`
          : "",
        quantity: !!material.quantity
          ? `${material.quantity} ${material.measurement.name}`
          : "",
        presentation: !!material.presentation
          ? `${material.presentation} ${material.measurement.name}`
          : "",
        sensibleMaterial: material.sensibleMaterial ? "Si" : "No",
        superUse: material.superUse ? "Si" : "No",
        storagePlace: material.storagePlace.name,
        expirationDate: material.expirationDate
          ? new Date(material.expirationDate).toLocaleDateString("es-VE")
          : "",
      })) ?? []
    );
  }, [currentMaterialType, materialList, searchValue]);

  const handleMaterialDetails = (materialData?: TMaterial, show = true) => {
    setCurrentMaterial(materialData);
    setOpenModal(show);
  };

  const handleDeleteMaterial = async (materialData?: TMaterial) => {
    if (typeof materialData === "undefined") {
      openNotification(
        "error",
        "No se ha seleccionado material a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      await deleteMaterial(sessionData?.user.token ?? "", materialData.id);
      refetch();
      setCurrentMaterial(undefined);
      setOpenModal(false);
      openNotification(
        "success",
        "Material eliminado",
        `Se ha eliminado el material ${materialData.name}`,
        "topRight",
      );
    } catch (error) {
      openNotification(
        "error",
        "Ha ocurrido un error al eliminar el material",
        "",
        "topRight",
      );
    }
  };

  return {
    openModal,
    tableData,
    currentMaterial,
    materialTypeList,
    currentMaterialType,
    notificationElement,
    isLoading,
    handleMaterialDetails,
    handleDeleteMaterial,
    setSearchValue,
    setOpenModal,
    setCurrentMaterialType,
  };
}
