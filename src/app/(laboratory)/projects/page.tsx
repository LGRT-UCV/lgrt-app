"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Divider, Popover, Tag, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Routes } from "@/lib/constants";
import type { IProject } from "./interfaces";
import useProject from "./useProject";
import { fieldsProject } from "./utils";
import DetailsModal from "./project/components/detailsModal";


export default function Inventory () {
  const router = useRouter();
  const {
    openModal,
    tableData,
    currentProject,
    notificationElement,
    isLoading,
    handleProjectDetails,
    handleDeleteProject,
    setSearchValue,
    setOpenModal,
    handleUpdateProject,
  } = useProject();

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
    const columsList = fieldsProject.filter(
      field => !["comments", "projectMaterial", "fileUri", "file", "status"].includes(field.id)
    );
    const columnToShow: TableColumnsType<AnyObject> = columsList.map((column) => ({
      title: column.label,
      width: "description" === column.id ? 50 : 20,
      dataIndex: column.id,
      key: column.id,
      fixed: column.id === "name" ? "left" : undefined,
      align: "center",
    }));
    const renderColumns = columnToShow.concat([
      {
        title: "Status",
        align: "center",
        width: 20,
        render: (record: IProject & { key: string }) => (
          <Tag color={getStatus(record.status).statusColor} className="mx-auto">{getStatus(record.status).status}</Tag>
        )
      },
      {
        title: "Archivo",
        align: "center",
        width: 20,
        render: (record: IProject & { key: string }) => (
          <div className="text-center mx-auto">
            <a href={record.fileUri} target="_blank">
              <strong>Ver Archivo</strong>
            </a>
          </div>
        )
      },
      {
        title: "Comentarios",
        align: "center",
        width: 10,
        render: (record: IProject & { key: string }) => (
          <p className="text-center">{record.comments?.length ?? 0}</p>
        )
      },
      {
        width: 5,
        fixed: "right",
        align: "center",
        render: (record: IProject & { key: string }) => (
          <Popover
            placement="topRight"
            content={(
              <div className="text-center">
                <Divider className="m-2"/>
                <span
                  onClick={() => handleProjectDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Ver proyecto
                </span>
                <Divider className="m-2"/>
                <span
                  onClick={() => void handleDeleteProject(record)}
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
        title="Proyectos"
        btn={{
          label: "Añadir nuevo",
          icon: <PlusOutlined />,
          onClick: () => void router.push(Routes.SaveProject),
        }}
      />

      <TableFilter filters={filters}/>
      
      <Table
        columns={columns}
        data={tableData.reverse()}
        isLoading={isLoading}
      />

      <Modal
        title="Detalles del material"
        centered
        open={openModal}
        okText={"Editar"}
        onOk={() => handleProjectDetails()}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{
          className: "bg-blue-500"
        }}
        footer={[
          <Button
            key="delete"
            className="bg-red-500 hover:!bg-red-400 !text-white border-none"
            onClick={() => void handleDeleteProject(currentProject)}
          >
            Eliminar proyecto
          </Button>
        ]}
      >
        <DetailsModal project={currentProject} closeModal={handleUpdateProject} />
      </Modal>
    </>
  )
};