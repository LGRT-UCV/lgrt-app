"use client";

import { useMemo } from "react";
import Table, { type TTableData } from "@/components/dataDisplay/table";
import type { TableColumnsType } from "antd";
import Title from "antd/es/typography/Title";


export default function Inventory () {

  // Example data
  const columns: TableColumnsType<TTableData> = [
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

  const tableData: Array<TTableData> = useMemo(() => {
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
    <div className="flex flex-col gap-8 p-4">
      <Title>Inventario</Title>
      <Table
        columns={columns}
        data={tableData}
      />
    </div>
  )
};