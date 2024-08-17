"use client";

import { useMemo } from "react";
import {
  Modal,
  Button,
  Divider,
  Popover,
  Tag,
  type TableColumnsType,
} from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import useRequest from "./hooks/useRequest";
import { getStatus, requestFields, requestStatus } from "./utils";
import { IRequest } from "./interfaces";
import DetailsModal from "./components/modals/detailsModal";
import CreateRequestModal from "./components/modals/createRequestModal";
import { isMobile } from "react-device-detect";
import { dateToTimestamp } from "@/utils";

export default function Requests() {
  const [form] = useForm();
  const {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentRequest,
    notificationElement,
    isLoading,
    ableToDelete,
    handleRequestDetails,
    handleDeleteRequest,
    setSearchValue,
    setRequestStatus,
    setOpenDetailsModal,
    setOpenCreateModal,
    handleUpdateRequest,
  } = useRequest();

  const sorter = (a: AnyObject, b: AnyObject, column: string) => {
    switch (column) {
      case "id":
        return Number(a.id) - Number(b.id);
      case "requester":
        return a.requester.localeCompare(b.requester);
      case "dateupd":
        return (
          dateToTimestamp(String(a.dateupd)) -
          dateToTimestamp(String(b.dateupd))
        );
    }
  };

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columsList = requestFields.filter((fields) => "status" !== fields.id);
    const columnToShow: TableColumnsType<AnyObject> = columsList.map(
      (column) => ({
        title: column.label,
        width: "idRequester" === column.id ? 50 : "id" === column.id ? 7 : 20,
        dataIndex: column.id,
        sorter: ["id", "requester", "dateupd"].includes(column.id)
          ? (a, b) => sorter(a, b, column.id)
          : undefined,
        key: column.id,
        fixed:
          ["id", "idRequester"].includes(column.id) && !isMobile
            ? "left"
            : undefined,
        align: "center",
      }),
    );
    const renderColumns = columnToShow.concat([
      {
        title: "Status",
        align: "center",
        width: 20,
        render: (record: IRequest & { key: string }) => (
          <Tag color={getStatus(record.status).statusColor} className="mx-auto">
            {getStatus(record.status).status}
          </Tag>
        ),
      },
      {
        width: isMobile ? 4 : 10,
        fixed: "right",
        align: "center",
        render: (record: IRequest & { key: string }) => (
          <Popover
            placement="topRight"
            content={
              <div className="text-center">
                <Divider className="m-2" />
                <span
                  onClick={() => handleRequestDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Ver solicitud
                </span>
                <Divider className="m-2" />
                {ableToDelete(record) ? (
                  <span
                    onClick={() => void handleDeleteRequest(record)}
                    className="h-full w-full cursor-pointer"
                  >
                    Eliminar
                  </span>
                ) : null}
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
    {
      label: "Filtrar por estado",
      placeholder: "Selecciona el estado",
      type: FilterType.SELECT,
      values: [{ label: "Todos los estados", value: "all" }, ...requestStatus],
      onChange(value) {
        setRequestStatus(String(value));
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
        title="Crea una nueva solicitud"
        centered
        open={openCreateModal}
        okText={"Editar"}
        onCancel={() => {
          setOpenCreateModal(false);
          handleUpdateRequest();
          form.resetFields();
        }}
        width={800}
        footer={[
          <Button
            key="create"
            className="bg-blue-500 text-white"
            onClick={form.submit}
          >
            Crear solicitud
          </Button>,
        ]}
      >
        <CreateRequestModal form={form} closeModal={handleUpdateRequest} />
      </Modal>

      <Modal
        title="Detalles de la solicitud"
        centered
        open={openDetailsModal}
        onCancel={() => {
          setOpenDetailsModal(false);
          handleUpdateRequest();
          form.resetFields();
        }}
        width={600}
        okButtonProps={{
          className: "bg-blue-500",
        }}
        footer={
          ableToDelete()
            ? [
                <Button
                  key="delete"
                  className="border-none bg-red-500 !text-white hover:!bg-red-400"
                  onClick={() => void handleDeleteRequest(currentRequest)}
                >
                  Eliminar solcitud
                </Button>,
              ]
            : []
        }
      >
        <DetailsModal
          request={currentRequest}
          closeModal={() => {
            setOpenDetailsModal(false);
            handleUpdateRequest();
            handleRequestDetails(undefined, false);
          }}
        />
      </Modal>
    </>
  );
}
