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
import { fileFields } from "./utils";
import type { IFile } from "./interfaces";
import useFile from "./hooks/useFiles";
import CreateFileModal from "./components/modals/createFileModal";

export default function Files () {
  const [form] = useForm();
  const {
    tableData,
    isLoading,
    notificationElement,
    openCreateModal,
    handleFileDetails,
    handleUpdateFile,
    handleDeleteFile,
    setOpenCreateModal,
    setSearchValue
  } = useFile();

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columnToShow: TableColumnsType<AnyObject> = fileFields.map((column) => ({
      title: column.label,
      width: ["name", "description"].includes(column.id) ? 60 : 20,
      dataIndex: column.id,
      key: column.id,
      fixed: ["name", "fileType"].includes(column.id) ? "left" : undefined,
      align: "center",
    }));
    const renderColumns = columnToShow.concat([
      {
        align: "center",
        width: 20,
        render: (record: IFile & { key: string }) => (
          <div className="text-center mx-auto">
            <a href={record.file?.[0]} target="_blank">
              <strong>Descargar</strong>
            </a>
          </div>
        )
      },
      {
        width: 10,
        fixed: "right",
        align: "center",
        render: (record: IFile & { key: string }) => (
          <Popover
            placement="topRight"
            content={(
              <div className="text-center">
                <Divider className="m-2"/>
                <span
                  onClick={() => handleFileDetails(record)}
                  className="h-full w-full cursor-pointer"
                >
                  Editar
                </span>
                <Divider className="m-2"/>
                <span
                  onClick={() => void handleDeleteFile(record)}
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
        title="Subir un nuevo archivo"
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
            Subir archivo
          </Button>
        ]}
      >
        <CreateFileModal form={form} closeModal={handleUpdateFile} />
      </Modal>
    </>
  )
};