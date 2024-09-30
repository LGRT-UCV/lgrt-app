"use client";

import React, { useMemo } from "react";
import { Modal, Button, Divider, Popover, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { materialTypeFields } from "./utils";
import type { IMaterialType } from "./interfaces";
import useMaterialType from "./hooks/useMaterialType";
import CreateMaterialTypeModal from "./components/createMaterialTypeModal";
import { isMobile } from "react-device-detect";

export default function MaterialType() {
  const [form] = useForm();
  const {
    tableData,
    isLoading,
    notificationElement,
    openCreateModal,
    currentMaterialType,
    handleUpdateMaterialType,
    handleDeleteMaterialType,
    setSearchValue,
    setOpenCreateModal,
    setCurrentMaterialType,
  } = useMaterialType();

  const sorter = (a: AnyObject, b: AnyObject, column: string) => {
    switch (column) {
      case "id":
      case "existentMaterials":
        return Number(a.id) - Number(b.id);
      case "name":
        return a.name.localeCompare(b.name);
    }
  };

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = materialTypeFields
      .filter((field) => field.id !== "description")
      .map((column) => ({
        title: column.label,
        width: "name" === column.id ? 50 : "id" === column.id ? 10 : 20,
        dataIndex: column.id,
        sorter: ["id", "name", "existentMaterials"].includes(column.id)
          ? (a, b) => sorter(a, b, column.id)
          : undefined,
        key: column.id,
        fixed:
          ["id", "name"].includes(column.id) &&
          !isMobile &&
          column.id !== "name"
            ? "left"
            : undefined,
        align: "center",
      }));
    const renderColumns = columnToShow.concat([
      {
        width: 5,
        fixed: "right",
        align: "center",
        render: (record: IMaterialType & { key: string }) => (
          <Popover
            placement="topRight"
            content={
              <div className="text-center">
                <span
                  onClick={() => {
                    setCurrentMaterialType(record);
                    setOpenCreateModal(true);
                  }}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                <Divider className="m-2" />
                <span
                  onClick={() => void handleDeleteMaterialType(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Eliminar
                </span>
              </div>
            }
            title="Opciones"
          >
            <MoreOutlined className="cursor-pointer" />
          </Popover>
        ),
      },
    ]);
    return renderColumns;
  }, []);

  const filters: Array<TFilter> = [
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
        title="Tipos de materiales"
        btn={{
          label: "Añadir nuevo",
          icon: <PlusOutlined />,
          onClick: () => setOpenCreateModal(true),
        }}
      />

      <TableFilter filters={filters} />

      <Table
        columns={columns}
        data={tableData.reverse()}
        isLoading={isLoading}
        scrollX={1000}
      />

      <Modal
        title={`${!!currentMaterialType ? "Editar" : "Crear"} tipo de material`}
        centered
        open={openCreateModal}
        onCancel={() => {
          form.resetFields();
          setOpenCreateModal(false);
          setCurrentMaterialType(undefined);
        }}
        width={800}
        footer={[
          <Button
            key="success"
            className="bg-blue-500 text-white"
            onClick={form.submit}
          >
            Guardar
          </Button>,
        ]}
      >
        <CreateMaterialTypeModal
          form={form}
          closeModal={handleUpdateMaterialType}
          data={currentMaterialType}
        />
      </Modal>
    </>
  );
}
