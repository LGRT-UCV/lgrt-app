"use client";

import { useMemo } from "react";
import { Modal, Button, Divider, Popover, Tag, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import useRequest from "./hooks/useRequest";
import { getStatus, requestFields } from "./utils";
import { IRequest } from "./interfaces";
import DetailsModal from "./components/modals/detailsModal";
import CreateRequestModal from "./components/modals/createRequestModal";
import { isMobile } from "react-device-detect";

export default function Requests () {
  const [form] = useForm();
  const {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentRequest,
    notificationElement,
    isLoading,
    handleRequestDetails,
    handleDeleteRequest,
    setSearchValue,
    setOpenDetailsModal,
    setOpenCreateModal,
    handleUpdateRequest,
  } = useRequest();

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columsList = requestFields.filter(fields => "status" !== fields.id);
    const columnToShow: TableColumnsType<AnyObject> = columsList.map((column) => ({
      title: column.label,
      width: "idRequester" === column.id ? 50 : "id" === column.id ? 7 : 20,
      dataIndex: column.id,
      key: column.id,
      fixed: ["id", "idRequester"].includes(column.id) && !isMobile ? "left" : undefined,
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
        width: isMobile ? 4 : 10,
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
          onClick: () => setOpenCreateModal(true),
        }}
      />

      <TableFilter filters={filters}/>
      
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
        onCancel={() => setOpenCreateModal(false)}
        width={800}
        footer={[
          <Button
            key="create"
            className="bg-blue-500 text-white"
            onClick={form.submit}
          >
            Crear solicitud
          </Button>
        ]}
      >
        <CreateRequestModal form={form} closeModal={handleUpdateRequest} />
      </Modal>

      <Modal
        title="Detalles de la solicitud"
        centered
        open={openDetailsModal}
        okText={"Editar"}
        onCancel={() => setOpenDetailsModal(false)}
        width={600}
        okButtonProps={{
          className: "bg-blue-500"
        }}
        footer={[
          <Button
            key="delete"
            className="bg-red-500 hover:!bg-red-400 !text-white border-none"
            onClick={() => void handleDeleteRequest(currentRequest)}
          >
            Eliminar solcitud
          </Button>
        ]}
      >
        <DetailsModal request={currentRequest} closeModal={handleUpdateRequest} />
      </Modal>
    </>
  )
};