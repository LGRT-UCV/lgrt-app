"use client";

import { useMemo } from "react";
import { Modal, Button, Divider, Popover, type TableColumnsType, Tag } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { getStatus, userFields } from "./utils";
import type { IUser } from "./interfaces";
import useUser from "./hooks/useUsers";
import { CreateUserModal } from "./components/createUserModal";
import DetailsModal from "./components/detailsUserModal";
import { isMobile } from "react-device-detect";

export default function Users () {
  const {
    form,
    tableData,
    isLoading,
    currentUser,
    notificationElement,
    openCreateModal,
    openDetailsModal,
    handleUserDetails,
    handleUpdateUser,
    handleUserStatus,
    setOpenCreateModal,
    setOpenDetailsModal,
    setCurrentUser,
    setSearchValue
  } = useUser();

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = userFields.map((column) => ({
      title: column.label,
      width: ["id", "name", "lastname"].includes(column.id) ? 40 : 20,
      dataIndex: column.id,
      key: column.id,
      fixed: "name" === column.id && !isMobile ? "left" : undefined,
      align: "center",
    }));
    const renderColumns = columnToShow.concat([
      {
        title: "Status",
        align: "center",
        width: 20,
        render: (record: IUser & { key: string }) => (
          <Tag color={getStatus(record.status).statusColor} className="mx-auto w-full text-center">{getStatus(record.status).status}</Tag>
        )
      },
      {
        width: isMobile ? 10 : 15,
        fixed: "right",
        align: "center",
        render: (record: IUser & { key: string }) => (
          <Popover
            placement="topRight"
            content={(
              <div className="text-center">
                <Divider className="m-2"/>
                <span
                  onClick={() => handleUserDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Ver
                </span>
                <Divider className="m-2"/>
                <span
                  onClick={() => {
                    setCurrentUser(record);
                    setOpenCreateModal(true);
                  }}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                <Divider className="m-2"/>
                <span
                  onClick={() => handleUserStatus(
                    record.id ?? "",
                    record.status === "A" ? "I" : "A"
                  )}
                  className="h-full w-full cursor-pointer"
                >
                  {record.status === "A" ? "Desactivar" : "Activar"}
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
        title="Usuarios"
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
        title={`${!!currentUser ? "Editar" : "Crear"} usuario`}
        centered
        open={openCreateModal}
        okText={"Editar"}
        onCancel={() => setOpenCreateModal(false)}
        width={800}
        footer={[
          <Button
            key="success"
            className="bg-blue-500 text-white"
            onClick={form.submit}
          >
            Guardar Usuario
          </Button>
        ]}
      >
        <CreateUserModal form={form} closeModal={handleUpdateUser} data={currentUser} />
      </Modal>

      <Modal
        title="Detalles del usuario"
        centered
        open={openDetailsModal}
        onCancel={() => setOpenDetailsModal(false)}
        width={800}
        footer={[
          <Button
            key="status"
            className={`${currentUser?.status === "A" ? "bg-red-500" : "bg-green-500"} text-white`}
            onClick={() => handleUserStatus(
              currentUser?.id ?? "",
              currentUser?.status === "A" ? "I" : "A"
            )}
          >
            {currentUser?.status === "A" ? "Desactivar" : "Activar"}
          </Button>
        ]}
      >
        <DetailsModal user={currentUser} />
      </Modal>
    </>
  )
};