"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Divider, Popover, Tag, type TableColumnsType } from "antd";
import { PlusOutlined, MoreOutlined, ExportOutlined } from "@ant-design/icons";
import type { AnyObject } from "antd/es/_util/type";
import { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import TableFilter from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Roles, Routes } from "@/lib/constants";
import type { IProject } from "./interfaces";
import useProject from "./useProject";
import { fieldsProject, getProjectStatusStyle, projectStatus } from "./utils";
import { isMobile } from "react-device-detect";
import { useLabProvider } from "@/context/labProvider";

export default function Projects() {
  const { role } = useLabProvider();
  const router = useRouter();
  const {
    tableData,
    notificationElement,
    isLoading,
    handleDeleteProject,
    setSearchValue,
    setProjectStatus,
  } = useProject();

  const sorter = (a: AnyObject, b: AnyObject, column: string) => {
    switch (column) {
      case "id":
        return Number(a.id) - Number(b.id);
      case "name":
        return a.name.localeCompare(b.name);
    }
  };

  const columns: TableColumnsType<AnyObject> = useMemo(() => {
    const columsList = fieldsProject.filter(
      (field) =>
        ![
          "comments",
          "projectMaterial",
          "projectUri",
          "file",
          "status",
        ].includes(field.id),
    );
    const columnToShow: TableColumnsType<AnyObject> = columsList.map(
      (column) => ({
        title: column.label,
        width: "description" === column.id ? 50 : "id" === column.id ? 5 : 20,
        dataIndex: column.id,
        sorter: ["id", "name"].includes(column.id)
          ? {
              compare: (a, b) => sorter(a, b, column.id),
              multiple: column.id === "id" ? 1 : 2,
            }
          : undefined,
        key: column.id,
        fixed: column.id === "name" && !isMobile ? "left" : undefined,
        align: "center",
      }),
    );
    const renderColumns = columnToShow.concat([
      {
        title: "Status",
        align: "center",
        width: 20,
        render: (record: IProject & { key: string }) => {
          const statusStyle = getProjectStatusStyle(record.status);
          return (
            <Tag color={statusStyle.statusColor} className="mx-auto">
              {statusStyle.status}
            </Tag>
          );
        },
      },
      {
        title: "Archivo",
        align: "center",
        width: 20,
        render: (record: IProject & { key: string }) => (
          <div className="mx-auto text-center">
            <a href={record.projectUri} target="_blank" rel="noreferrer">
              <strong>Abrir URL</strong>
              <ExportOutlined />
            </a>
          </div>
        ),
      },
      {
        width: 5,
        fixed: "right",
        align: "center",
        render: (record: IProject & { key: string }) => (
          <Popover
            placement="topRight"
            content={
              <div className="text-center">
                <Divider className="m-2" />
                <span
                  onClick={() =>
                    void router.push(Routes.SaveProject + `/${record.id}`)
                  }
                  className="h-full w-full cursor-pointer"
                >
                  Ver proyecto
                </span>
                {Roles.External !== role &&
                  ["A", "I"].includes(record?.status ?? "") && (
                    <>
                      {record.status === "A" && (
                        <>
                          <Divider className="m-2" />
                          <span
                            onClick={() =>
                              void router.push(
                                Routes.SaveProject + `?id=${record.id}`,
                              )
                            }
                            className="h-full w-full cursor-pointer"
                          >
                            Editar
                          </span>
                        </>
                      )}
                      <Divider className="m-2" />
                      <span
                        onClick={() => void handleDeleteProject(record)}
                        className="h-full w-full cursor-pointer"
                      >
                        Eliminar
                      </span>
                    </>
                  )}
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
      values: [{ label: "Todos los estados", value: "all" }, ...projectStatus],
      onChange(value) {
        setProjectStatus(String(value));
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

      <TableFilter filters={filters} />

      <Table
        columns={columns}
        data={tableData.reverse()}
        isLoading={isLoading}
      />
    </>
  );
}
