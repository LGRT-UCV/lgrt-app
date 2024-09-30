"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Divider, Popover, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Roles, Routes } from "@/lib/constants";
import DetailsModal from "./material/components/detailsModal";
import { fieldsToList } from "./material/utils";
import useInventory from "./useInventory";
import type { TMaterial } from "./interfaces";
import { isMobile } from "react-device-detect";
import { useLabProvider } from "@/context/labProvider";
import { extractNumber } from "@/utils";

export default function Inventory() {
  const { role } = useLabProvider();
  const router = useRouter();
  const {
    openModal,
    materialTypeList,
    tableData,
    currentMaterial,
    currentMaterialType,
    notificationElement,
    isLoading,
    handleMaterialDetails,
    handleDeleteMaterial,
    setCurrentMaterialType,
    setSearchValue,
    setOpenModal,
  } = useInventory();

  const sorter = (a: AnyObject, b: AnyObject, column: string) => {
    switch (column) {
      case "id":
        return Number(a.id) - Number(b.id);
      case "name":
        return a.name.localeCompare(b.name);
      case "weight":
        return (
          extractNumber(String(a.weight)) - extractNumber(String(b.weight))
        );
      case "quantity":
        return (
          extractNumber(String(a.quantity)) - extractNumber(String(b.quantity))
        );
    }
  };

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    if (typeof currentMaterialType === "undefined") return [];

    const materialFileds = currentMaterialType.fields?.split(";") ?? [];
    materialFileds.push("id");
    const columsList = fieldsToList.filter((field) =>
      materialFileds.includes(field.id),
    );
    const columnToShow: TableColumnsType<AnyObject> = columsList.map(
      (column) => ({
        title: column.label,
        width: column.id === "id" ? 20 : 30,
        dataIndex: column.id,
        key: column.id,
        sorter: ["id", "name", "weight", "quantity"].includes(column.id)
          ? (a, b) => sorter(a, b, column.id)
          : undefined,
        fixed:
          ["id", "name"].includes(column.id) &&
          !isMobile &&
          column.id !== "name"
            ? "left"
            : undefined,
        align: "center",
      }),
    );
    columnToShow.push({
      width: 10,
      fixed: "right",
      render: (record: TMaterial & { key: string }) => (
        <Popover
          placement="topRight"
          content={
            <div className="text-center">
              <Divider className="m-2" />
              <span
                onClick={() => handleMaterialDetails(record)}
                className="h-full w-full cursor-pointer"
              >
                Ver material
              </span>
              {Roles.External !== role && (
                <>
                  <Divider className="m-2" />
                  <span
                    onClick={() =>
                      void router.push(`${Routes.SaveMaterial}?id=${record.id}`)
                    }
                    className="h-full w-full cursor-pointer"
                  >
                    Editar
                  </span>
                  <Divider className="m-2" />
                  <span
                    onClick={() => void handleDeleteMaterial(record)}
                    className="h-full w-full cursor-pointer"
                  >
                    Eliminar
                  </span>
                </>
              )}
            </div>
          }
          title="Opciones"
        >
          <MoreOutlined className="cursor-pointer" />
        </Popover>
      ),
    });
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
        setCurrentMaterialType(
          materialTypeList.find((material) => material.id === value),
        );
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

  return (
    <>
      {notificationElement}
      <Header
        title="Inventario"
        btn={
          Roles.External !== role
            ? {
                label: "Añadir nuevo",
                icon: <PlusOutlined />,
                onClick: () => void router.push(Routes.SaveMaterial),
              }
            : undefined
        }
      />

      <TableFilter filters={filters} />

      <Table columns={columns} data={tableData} isLoading={isLoading} />

      <Modal
        title="Detalles del material"
        centered
        open={openModal}
        okText={"Editar"}
        onOk={() => handleMaterialDetails()}
        onCancel={() => setOpenModal(false)}
        width={600}
        okButtonProps={{
          className: "!bg-blue-500",
        }}
        footer={
          Roles.External !== role
            ? [
                <Button
                  key="delete"
                  className="border-none !bg-red-500 !text-white hover:!bg-red-400"
                  onClick={() => void handleDeleteMaterial(currentMaterial)}
                >
                  Eliminar material
                </Button>,
              ]
            : []
        }
      >
        <DetailsModal
          material={currentMaterial}
          materialType={currentMaterialType}
        />
      </Modal>
    </>
  );
}
