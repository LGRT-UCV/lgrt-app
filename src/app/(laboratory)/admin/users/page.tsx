"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Divider, Popover, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { userFields } from "./utils";
import type { IUser } from "./interfaces";
import useUser from "./hooks/useUsers";
import { Routes } from "@/lib/constants";
import { CreateUserModal } from "./components/createUserModal";

export default function Users () {
  const router = useRouter();
  const [form] = useForm();
  const {
    tableData,
    isLoading,
    notificationElement,
    openCreateModal,
    handleUserDetails,
    handleUpdateUser,
    handleDeleteUser,
    setOpenCreateModal,
    setSearchValue
  } = useUser();

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = userFields.map((column) => ({
      title: column.label,
      width: ["id", "name", "lastname"].includes(column.id) ? 40 : 20,
      dataIndex: column.id,
      key: column.id,
      fixed: "name" === column.id ? "left" : undefined,
      align: "center",
    }));
    const renderColumns = columnToShow.concat([
      {
        width: 15,
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
                  onClick={() => void router.push(`${Routes.SaveMaterial}?id=${record.id}`)}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                <Divider className="m-2"/>
                <span
                  onClick={() => void handleDeleteUser(record)}
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
        title="Crear usuario"
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
            Crear Usuario
          </Button>
        ]}
      >
        <CreateUserModal form={form} closeModal={handleUpdateUser} />
      </Modal>
    </>
  )
};