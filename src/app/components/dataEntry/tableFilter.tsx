import { useMemo } from "react";
import { Select } from "antd";
import Search from "antd/es/input/Search";

export enum FilterType {
  SEARCH,
  SELECT,
};

type TFilterValue = {
  value: string | number;
  label?: string;
}

export type TFilter = {
  key?: string;
  label: string;
  type: FilterType;
  placeHolder: string;
  values?: Array<TFilterValue>
  onChange: (value: string | number, key?: string) => void;
};

interface ITableFilter {
  filters: Array<TFilter>;
};

export default function TableFilter ({
  filters,
}: ITableFilter) {
  const components: Array<JSX.Element> = useMemo(() => {
    return filters.map((element, key) => {
      if (element.type === FilterType.SEARCH) {
        return (
          <Search
            key={`search-filter-${key}`}
            placeholder={element.placeHolder}
            loading={false}
            value={element.values?.[0]?.value}
            onSearch={(value) => element.onChange(value)}
            className="w-1/5"
          />
        )
      }

      return (
        <Select
          key={`select-filter-${key}`}
          showSearch
          style={{ width: 200 }}
          placeholder={element.placeHolder}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={element.values}
          onChange={(value) => element.onChange(value, element.key)}
        />
      );
    });
  }, [filters]);

  return (
    <div className="w-full flex justify-between">
      {components}
    </div>
  )
};