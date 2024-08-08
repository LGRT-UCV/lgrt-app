"use client";

import { useMemo } from "react";
import { Modal, Button, Divider, Popover, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { fileFields } from "./utils";
import type { IFile } from "./interfaces";
import useFile from "./hooks/useFiles";
import CreateFileModal from "./components/modals/createFileModal";
import { isMobile } from "react-device-detect";
import { useLabProvider } from "@/context/labProvider";
import { Roles } from "@/lib/constants";

export default function Files() {
  const { role } = useLabProvider();
  const {
    form,
    tableData,
    isLoading,
    currentFile,
    notificationElement,
    openCreateModal,
    getFileUri,
    handleEditFile,
    handleUpdateFile,
    handleDeleteFile,
    setOpenCreateModal,
    setSearchValue,
  } = useFile();

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = fileFields.map(
      (column) => ({
        title: column.label,
        width: ["name", "description"].includes(column.id) ? 60 : 20,
        dataIndex: column.id,
        key: column.id,
        fixed:
          ["name", "fileType"].includes(column.id) && !isMobile
            ? "left"
            : undefined,
        align: "center",
      }),
    );
    columnToShow.push({
      align: "center",
      width: 20,
      render: (record: IFile & { key: string }) => {
        return (
          <div className="mx-auto text-center">
            <a
              onClick={() => void getFileUri(record.fileUri, record.fileType)}
              download={`${record.name}${record.fileType}`}
            >
              <strong>Descargar</strong>
            </a>
          </div>
        );
      },
    });

    if (Roles.External !== role) {
      columnToShow.push({
        width: 10,
        fixed: "right",
        align: "center",
        render: (record: IFile & { key: string }) => (
          <Popover
            placement="topRight"
            content={
              <div className="text-center">
                <Divider className="m-2" />
                <span
                  onClick={() => handleEditFile(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                <Divider className="m-2" />
                <span
                  onClick={() => void handleDeleteFile(record)}
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
      });
    }
    return columnToShow;
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
        title="Archivos"
        btn={
          [Roles.Admin, Roles.Personal, Roles.PersonalExtra].includes(role)
            ? {
                label: "Añadir nuevo",
                icon: <PlusOutlined />,
                onClick: () => setOpenCreateModal(true),
              }
            : undefined
        }
      />

      <TableFilter filters={filters} />

      <Table
        columns={columns}
        data={tableData.reverse()}
        isLoading={isLoading}
        scrollX={1000}
      />

      <Modal
        title="Subir un nuevo archivo"
        centered
        open={openCreateModal}
        okText={"Editar"}
        onCancel={() => {
          setOpenCreateModal(false);
          form.resetFields();
        }}
        width={800}
        footer={[
          <Button
            key="success"
            className="bg-blue-500 text-white"
            onClick={form.submit}
          >
            {!!currentFile ? "Actualizar" : "Subir archivo"}
          </Button>,
        ]}
      >
        <CreateFileModal
          form={form}
          fileData={currentFile}
          closeModal={handleUpdateFile}
        />
      </Modal>
    </>
  );
}
