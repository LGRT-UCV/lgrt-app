"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Divider, Popover, Modal, type TableColumnsType, Button } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import TableFilter, { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Routes } from "@/lib/constants";
import useMaterialInit from "./material/hooks/useMaterialInit";
import type { TMaterial, TMaterialType } from "./interfaces";
import { deleteMaterial, getAllMaterials } from "./utils";
import { fieldsToList } from "./material/utils";
import useNotification from "@/hooks/useNotification";
import DetailsModal from "./material/components/detailsModal";
import { useQuery } from "@tanstack/react-query";

export default function Inventory () {
  const { materialTypeList } = useMaterialInit(["materialType"]);
  const { openNotification, notificationElement } = useNotification();
  const [openModal, setOpenModal] = useState(false);
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const [refetchMaterials, setRefetchMaterials] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<TMaterial>();
  const [searchValue, setSearchValue] = useState("");
  const { data: sessionData } = useSession();
  const router = useRouter();
  
  const { data: materialList= [], isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      try {
        return await getAllMaterials(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification("error", "Ha ocurrido un error al obtener los materiales", "", "topRight");
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  useEffect(() => {
    if (
      typeof materialTypeList[0] === "undefined" ||
      typeof currentMaterialType !== "undefined"
    ) return;
    
    setCurrentMaterialType(materialTypeList[0]);
  }, [materialTypeList, currentMaterialType]);

  // Example data
  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    if (typeof currentMaterialType === "undefined") return [];

    const materialFileds = currentMaterialType.fields?.split(";") ?? [];
    const columsList = fieldsToList.filter((field) => materialFileds.includes(field.id));
    const columnToShow: TableColumnsType<AnyObject> = columsList.map((column) => ({
      title: column.label,
      width: 100,
      dataIndex: column.id,
      key: column.id,
      fixed: column.id === "name" ? "left" : undefined,
      align: "center",
    }));
    columnToShow.push(({
      width: 30,
      fixed: "right",
      render: (record: TMaterial & { key: string }) => (
        <Popover
          placement="topRight"
          content={(
            <div className="text-center">
              <Divider className="m-2"/>
              <span
                onClick={() => handleMaterialDetails(record)}
                className="h-full w-full cursor-pointer"
              >
                Ver material
              </span>
              <Divider className="m-2"/>
              <span
                onClick={() => void router.push(`${Routes.SaveMaterial}?id=${record.id}`)}
                className="h-full w-full cursor-pointer"
              >
                  Editar
              </span>
              <Divider className="m-2"/>
              <span
                onClick={() => void handleDeleteMaterial(record)}
                className="h-full w-full cursor-pointer"
              >
                Eliminar
              </span>
            </div>
          )}
          title="Opciones"
        >
          <MoreOutlined className="cursor-pointer"/>
        </Popover>
      ),
    }));
    return columnToShow;
  }, [currentMaterialType]);

  const filters: Array<TFilter> = [
    {
      label: "Tipo de material",
      placeholder: "Selecciona el material",
      type: FilterType.SELECT,
      values: materialTypeList.map((materialType) => ({
        label: materialType.name,
        value: materialType.id,
      })),
      defaultValue: currentMaterialType?.id,
      onChange(value) {
        setCurrentMaterialType(materialTypeList.find((material) => material.id === value))
      },
    },
    {
      label: "Buscar",
      placeholder: "Buscar...",
      type: FilterType.SEARCH,
      onChange(value) {
        setSearchValue(String(value));
      },
    },
  ];

  const tableData: Array<AnyObject> = useMemo(() => {
    const currentMaterials = materialList.filter((material) => 
      material.materialType.id === currentMaterialType?.id &&
      material.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
    return currentMaterials?.map((material, index) => ({
      ...material,
      key: `material-${index}`,
      materialType: currentMaterialType?.name,
      weight: `${material.weight} ${material.measurement.name}`,
      capacity: !!material.capacity ? `${material.capacity} ${material.measurement.name}` : "",
      quantity: !!material.quantity ? `${material.quantity} ${material.measurement.name}` : "",
      presentation: !!material.presentation ? `${material.presentation} ${material.measurement.name}` : "",
      sensibleMaterial: material.sensibleMaterial ? "Si" : "No",
      superUse: material.superUse ? "Si" : "No",
      expirationDate: material.expirationDate ?
        new Date(material.expirationDate).toLocaleDateString("es-VE") :
        "",
    })) ?? [];
  }, [currentMaterialType, materialList, searchValue]);

  const handleMaterialDetails = (materialData?: TMaterial, show = true) => {
    setCurrentMaterial(materialData)
    setOpenModal(show);
  };

  const handleDeleteMaterial = async (materialData?: TMaterial) => {
    if (typeof materialData === "undefined") {
      openNotification("error", "No se ha seleccionado material a eliminar", "", "topRight");
      return;
    }

    try {
      await deleteMaterial(
        sessionData?.user.token ?? "",
        materialData.id
      );
      setRefetchMaterials(!refetchMaterials);
      setCurrentMaterial(undefined);
      setOpenModal(false);
      openNotification(
        "success",
        "Material eliminado",
        `Se ha eliminado el material ${materialData.name}`,
        "topRight"
      );
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al eliminar el material", "", "topRight");
    }
  } 

  return (
    <>
      {notificationElement}
      <Header
        title="Inventario"
        btn={{
          label: "Añadir nuevo",
          icon: <PlusOutlined />,
          onClick: () => void router.push(Routes.SaveMaterial),
        }}
      />

      <TableFilter filters={filters}/>
      
      <Table
        columns={columns}
        data={tableData.reverse()}
        isLoading={isLoading}
      />

      <Modal
        title="Detalles del material"
        centered
        open={openModal}
        okText={"Editar"}
        onOk={() => handleMaterialDetails()}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{
          className: "bg-blue-500"
        }}
        footer={[
          <Button
            key="delete"
            className="bg-red-500 hover:!bg-red-400 !text-white border-none"
            onClick={() => void handleDeleteMaterial(currentMaterial)}
          >
            Eliminar material
          </Button>
        ]}
      >
        <DetailsModal material={currentMaterial} />
      </Modal>
    </>
  )
};