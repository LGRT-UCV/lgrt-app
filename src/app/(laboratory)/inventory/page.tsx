"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Divider, Popover, Modal, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import TableFilter, { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Routes } from "@/lib/constants";
import useMaterialInit from "./material/hooks/useMaterialInit";
import type { TMaterial, TMaterialType } from "./interfaces";
import { getAllMaterials } from "./utils";
import { fieldsToList } from "./material/utils";
import useNotification from "@/hooks/useNotification";
import { useSession } from "next-auth/react";
import DetailsModal from "./material/components/detailsModal";

export default function Inventory () {
  const { materialTypeList } = useMaterialInit();
  const { openNotification, notificationElement } = useNotification();
  const [openModal, setOpenModal] = useState(false);
  const [materialList, setMaterialList] = useState<Array<TMaterial>>([]);
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const [currentMaterial, setCurrentMaterial] = useState<TMaterial>();
  const [searchValue, setSearchValue] = useState("");
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionData?.user.token) return;
    const getMaterials = async () => {
      try {
        const materials = await getAllMaterials(sessionData?.user.token ?? "");
        setMaterialList(materials);
      } catch (error) {
        openNotification("error", "Ha ocurrido un error al obtener los materiales", "", "topRight");
      }
    };
    void getMaterials();
  }, [sessionData]);

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
              <span onClick={() => handleMaterialDetails(record)} className="h-full w-full cursor-pointer">Ver material</span>
              <Divider className="m-2"/>
              <span
                onClick={() => void router.push(`${Routes.SaveMaterial}?material=${record.id}`)}
                className="h-full w-full cursor-pointer"
              >
                  Editar
              </span>
              <Divider className="m-2"/>
              <span className="h-full w-full cursor-pointer">Eliminar</span>
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
    return currentMaterials.map((material, index) => ({
      ...material,
      key: `material-${index}`,
      materialType: currentMaterialType?.name,
      weight: `${material.weight} ${material.measurement.name}`,
      capacity: `${material.capacity} ${material.measurement.name}`,
      quantity: `${material.quantity} ${material.measurement.name}`,
      presentation: `${material.presentation} ${material.measurement.name}`,
      sensibleMaterial: material.sensibleMaterial ? "Si" : "No",
      superUse: material.superUse ? "Si" : "No",
      expirationDate: material.expirationDate ?
        new Date(material.expirationDate).toLocaleDateString("es-VE") :
        "",
    }));
  }, [currentMaterialType, materialList, searchValue]);

  const handleMaterialDetails = (material?: TMaterial, show = true) => {
    setCurrentMaterial(material)
    setOpenModal(show);
  };

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
        data={tableData}
      />

      <Modal
        title="Detalles del material"
        centered
        open={openModal}
        onOk={() => handleMaterialDetails()}
        onCancel={() => handleMaterialDetails(undefined, false)}
      >
        <DetailsModal material={currentMaterial} />
      </Modal>
    </>
  )
};