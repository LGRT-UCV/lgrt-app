"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TableColumnsType } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";
import TableFilter, { TFilter, FilterType } from "@/components/dataEntry/tableFilter";
import Table from "@/components/dataDisplay/table";
import Header from "@/components/layout/header";
import { Routes } from "@/lib/constants";

export default function Inventory () {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  // Example data
  const columns: TableColumnsType<AnyObject> = [
    {
      title: 'Full Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Age',
      width: 100,
      dataIndex: 'age',
      key: 'age',
      fixed: 'left',
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
      key: '1',
      width: 150,
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
      key: '2',
      width: 150,
    },
    {
      title: 'Column 3',
      dataIndex: 'address',
      key: '3',
      width: 150,
    },
    {
      title: 'Column 4',
      dataIndex: 'address',
      key: '4',
      width: 150,
    },
    {
      title: 'Column 5',
      dataIndex: 'address',
      key: '5',
      width: 150,
    },
    {
      title: 'Column 6',
      dataIndex: 'address',
      key: '6',
      width: 150,
    },
    {
      title: 'Column 7',
      dataIndex: 'address',
      key: '7',
      width: 150,
    },
    { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>,
    },
  ];

  const filters: Array<TFilter> = [
    {
      label: "Seleccionar",
      placeholder: "Selecciona un elemento",
      type: FilterType.SELECT,
      values: [
        {
          label: "Element 1",
          value: "element-1"
        },
        {
          label: "Element 2",
          value: "element-2"
        },
        {
          label: "Element 3",
          value: "element-3"
        },
      ],
      onChange(value) {
        console.log("select", value)
      },
    },
    {
      label: "Buscar",
      placeholder: "Buscar...",
      type: FilterType.SEARCH,
      values: [],
      onChange(value) {
        setSearchValue(String(value));
      },
    },
  ];

  const tableData: Array<AnyObject> = useMemo(() => {
    const auxData = [];

    for (let i = 0; i < 100; i++) {
      auxData.push({
        key: i,
        name: `Edward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
      });
    }

    return auxData;
  }, []);

  return (
    <>
      <Header
        title="Inventario"
        btn={{
          label: "Añadir nuevo",
          icon: <PlusOutlined />,
          onClick: () => void router.push(Routes.NewInventory),
        }}
      />

      <TableFilter filters={filters}/>
      
      <Table
        columns={columns}
        data={tableData}
      />
    </>
  )
};