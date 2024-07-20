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
import { laboratoryFields } from "./utils";
import type { ILaboratory } from "./interfaces";
import useLaboratory from "./hooks/useLaboratory";
import CreateLaboratoryModal from "./components/createLaboratoryModal";
import DetailsModal from "./components/detailsLaboratoryModal";
import { isMobile } from "react-device-detect";

export default function Laboratory() {
  const [form] = useForm();
  const {
    tableData,
    isLoading,
    notificationElement,
    openCreateModal,
    openDetailsModal,
    currentLaboratory,
    handleUpdateLaboratory,
    handleLaboratoryDetails,
    handleDeleteLaboratory,
    setSearchValue,
    setOpenDetailsModal,
    setOpenCreateModal,
    setCurrentLaboratory,
  } = useLaboratory();

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = laboratoryFields
      .filter((field) => field.id !== "description")
      .map((column) => ({
        title: column.label,
        width: "name" === column.id ? 60 : "id" === column.id ? 15 : 30,
        dataIndex: column.id,
        key: column.id,
        fixed: "name" === column.id && !isMobile ? "left" : undefined,
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
        width: isMobile ? 10 : 15,
        fixed: "right",
        align: "center",
        render: (record: ILaboratory & { key: string }) => (
          <Popover
            placement="topRight"
            content={
              <div className="text-center">
                <Divider className="m-2" />
                <span
                  onClick={() => handleLaboratoryDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Ver
                </span>
                <Divider className="m-2" />
                <span
                  onClick={() => {
                    setCurrentLaboratory(record);
                    setOpenCreateModal(true);
                  }}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                {/* <Divider className="m-2"/>
                <span
                  onClick={() => void handleDeleteLaboratory(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Eliminar
                </span> */}
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
        title="Laboratorios"
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
        title="Crear laboratorio"
        centered
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false);
          setCurrentLaboratory(undefined);
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
        <CreateLaboratoryModal
          form={form}
          closeModal={handleUpdateLaboratory}
          data={currentLaboratory}
        />
      </Modal>

      <Modal
        title="Detalles del laboratorio"
        centered
        open={openDetailsModal}
        onCancel={() => {
          setOpenDetailsModal(false);
          setCurrentLaboratory(undefined);
        }}
        width={800}
        footer={[
          <Button
            key="delete"
            className="bg-red-500 text-white"
            onClick={() => handleDeleteLaboratory(currentLaboratory)}
          >
            Eliminar
          </Button>,
        ]}
      >
        <DetailsModal laboratory={currentLaboratory} />
      </Modal>
    </>
  );
}
