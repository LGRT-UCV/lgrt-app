"use client";

import { useMemo } from "react";
import { Modal, Button, Divider, Popover, Tag, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Routes } from "@/lib/constants";
import useRequest from "./useRequest";
import { requestFields } from "./utils";
import { IRequest } from "./interfaces";

export default function Requests () {
  const {
    openModal,
    tableData,
    currentRequest,
    notificationElement,
    isLoading,
    handleRequestDetails,
    handleDeleteRequest,
    setSearchValue,
    setOpenModal,
    handleUpdateRequest,
  } = useRequest();

  const getStatus = (status: string) => {
    switch (status) {
      case "active":
        return {
          status: "Activo",
          statusColor: "green",
        };
      default:
        return {
          status: "Inactivo",
          statusColor: "red",
        };
    };
  };

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = requestFields.map((column) => ({
      title: column.label,
      width: "requester" === column.id ? 50 : 20,
      dataIndex: column.id,
      key: column.id,
      fixed: column.id === "requester" ? "left" : undefined,
      align: "center",
    }));
    const renderColumns = columnToShow.concat([
      {
        title: "Status",
        align: "center",
        width: 20,
        render: (record: IRequest & { key: string }) => (
          <Tag color={getStatus(record.status).statusColor} className="mx-auto">{getStatus(record.status).status}</Tag>
        )
      },
      {
        width: 5,
        fixed: "right",
        align: "center",
        render: (record: IRequest & { key: string }) => (
          <Popover
            placement="topRight"
            content={(
              <div className="text-center">
                <Divider className="m-2"/>
                <span
                  onClick={() => handleRequestDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Ver solicitud
                </span>
                <Divider className="m-2"/>
                <span
                  onClick={() => void handleDeleteRequest(record)}
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
      }
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
        title="Solicitudes"
        btn={{
          label: "Añadir nuevo",
          icon: <PlusOutlined />,
          onClick: () => console.log("Add new request"),
        }}
      />

      <TableFilter filters={filters}/>
      
      <Table
        columns={columns}
        data={tableData.reverse()}
        isLoading={isLoading}
      />

      <Modal
        title="Detalles de la solicitud"
        centered
        open={openModal}
        okText={"Editar"}
        onOk={() => handleRequestDetails()}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{
          className: "bg-blue-500"
        }}
        footer={[
          <Button
            key="delete"
            className="bg-red-500 hover:!bg-red-400 !text-white border-none"
            onClick={() => void handleDeleteRequest(currentRequest)}
          >
            Eliminar proyecto
          </Button>
        ]}
      >
        {/* <DetailsModal project={currentRequest} closeModal={handleUpdateRequest} /> */}
      </Modal>
    </>
  )
};