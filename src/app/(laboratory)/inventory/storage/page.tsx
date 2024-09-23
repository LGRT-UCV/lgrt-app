"use client";

import { useMemo } from "react";
import { Modal, Button, Divider, Popover, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { storageFields } from "./utils";
import type { IStorage } from "./interfaces";
import useStorage from "./hooks/useStorage";
import CreateStorageModal from "./components/createStorageModal";
import DetailsModal from "./components/detailsStorageModal";
import { isMobile } from "react-device-detect";

export default function Storage() {
  const [form] = useForm();
  const {
    tableData,
    isLoading,
    notificationElement,
    openCreateModal,
    openDetailsModal,
    currentStorage,
    handleUpdateStorage,
    handleStorageDetails,
    handleDeleteStorage,
    setSearchValue,
    setOpenDetailsModal,
    setOpenCreateModal,
    setCurrentStorage,
  } = useStorage();

  const sorter = (a: AnyObject, b: AnyObject, column: string) => {
    switch (column) {
      case "id":
        return Number(a.id) - Number(b.id);
      case "name":
        return a.name.localeCompare(b.name);
    }
  };

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = storageFields
      .filter((field) => field.id !== "description")
      .map((column) => ({
        title: column.label,
        width: "name" === column.id ? 30 : "id" === column.id ? 10 : 60,
        dataIndex: column.id,
        sorter: ["id", "name"].includes(column.id)
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
        width: 60,
        title: "Descripción",
        align: "center",
        dataIndex: "description",
        key: "description",
        render: (description: string) => (
          <p>
            {description.substring(0, 120) +
              (description.length >= 120 ? "..." : "")}
          </p>
        ),
      },
      {
        width: 5,
        fixed: "right",
        align: "center",
        render: (record: IStorage & { key: string }) => (
          <Popover
            placement="topRight"
            content={
              <div className="text-center">
                <Divider className="m-2" />
                <span
                  onClick={() => handleStorageDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Ver
                </span>
                <Divider className="m-2" />
                <span
                  onClick={() => {
                    setCurrentStorage(record);
                    setOpenCreateModal(true);
                  }}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                <Divider className="m-2" />
                <span
                  onClick={() => void handleDeleteStorage(record)}
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
        title="Almacenamiento"
        btn={{
          label: "Añadir nuevo",
          icon: <PlusOutlined />,
          onClick: () => {
            form.resetFields();
            setCurrentStorage(undefined);
            setOpenCreateModal(true);
          },
        }}
      />

      <TableFilter filters={filters} />

      <Table
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        scrollX={1000}
      />

      <Modal
        title="Crear almacenamiento"
        centered
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false);
          setCurrentStorage(undefined);
          form.resetFields();
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
        <CreateStorageModal
          form={form}
          closeModal={handleUpdateStorage}
          data={currentStorage}
        />
      </Modal>

      <Modal
        title="Detalles del almacenamiento"
        centered
        open={openDetailsModal}
        okButtonProps={{ hidden: true }}
        onCancel={() => {
          setOpenDetailsModal(false);
          setCurrentStorage(undefined);
        }}
        cancelText="Cerrar"
        width={800}
      >
        <DetailsModal storage={currentStorage} />
      </Modal>
    </>
  );
}
