import { Table as TableComponent } from "antd";
import type { TableColumnsType } from "antd";
import { AnyObject } from "antd/es/_util/type";

/**
 * Table interface
 *
 * @property `columns` table columns
 * @property `data` registries list
 * @property `isLoading` loading data
 * @property `scrollX` scroll x axis
 * @property `scrollY` scroll y axis
 */
export interface ITable {
  columns: TableColumnsType<AnyObject>;
  data: readonly AnyObject[];
  isLoading?: boolean;
  scrollX?: number;
  scrollY?: number;
}

/**
 * Table component
 *
 * @param columns table columns array
 * @param data table data
 * @param isLoading loading data
 * @param scrollX scroll x axis
 * @param scrollY scroll y axis
 *
 * @returns Table component view
 */
export default function Table({
  columns,
  data,
  isLoading,
  scrollX = 1800,
  scrollY = 500,
}: ITable) {
  return (
    <TableComponent
      columns={columns}
      dataSource={data}
      scroll={{ x: scrollX, y: scrollY }}
      loading={isLoading}
    />
  );
}
