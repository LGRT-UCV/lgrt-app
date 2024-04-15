import { Table as TableComponent } from 'antd';
import type { TableColumnsType } from 'antd';
import { AnyObject } from 'antd/es/_util/type';

/**
 * Table interface
 * 
 * @property `columns` table columns
 * @property `data` registries list
 */
export interface ITable {
  columns: TableColumnsType<AnyObject>;
  data: readonly AnyObject[];
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
      scroll={{ x: 1800, y: 800 }}
    />
  );
};