import { Table as TableComponent } from 'antd';
import type { TableColumnsType } from 'antd';

export type TTableData = {
  key: React.Key;
  name: string;
  age: number;
  address: string;
};

export interface ITable {
  columns: TableColumnsType<TTableData>;
  data: Array<TTableData>;
};

/**
 * Table component
 * 
 * @param columns table columns array
 * @param data table data
 * 
 * @returns Table component view
 */
export default function Table ({
  columns,
  data,
}: ITable) {

  return (
    <TableComponent
      columns={columns}
      dataSource={data}
      scroll={{ x: 1500, y: 800 }}
    />
  );
};