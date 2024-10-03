import { useMemo } from "react";
import { Select } from "antd";
import Search from "antd/es/input/Search";

export enum FilterType {
  SEARCH,
  SELECT,
  SELECT_SEARCH,
}

/**
 * Filter value type
 *
 * @property `value` filter value
 * @property `label` filter value label
 */
type TFilterValue = {
  value: string | number;
  label?: string;
};

/**
 * Filer type
 *
 * @property `key` filer key
 * @property `label` filter label
 * @property `type` filter type
 * @property `placeholder` filter placeholder
 * @property `values` filter values
 * @property `onChange` is called when the value is changed
 */
export type TFilter = {
  key?: string;
  label: string;
  type: FilterType;
  placeholder: string;
  values?: Array<TFilterValue>;
  defaultValue?: TFilterValue["value"];
  onChange: (value: TFilterValue["value"], key?: string) => void;
};

/**
 * Table filer interface
 *
 * @property `filters` filter element list
 */
interface ITableFilter {
  filters: Array<TFilter>;
}

/**
 * TableFilter component
 *
 * @param filters filter element list
 * @returns Table filter JSX component
 */
export default function TableFilter({ filters }: ITableFilter) {
  const components: Array<JSX.Element> = useMemo(() => {
    return filters.map((element, key) => {
      switch (element.type) {
        case FilterType.SEARCH:
          return (
            <Search
              key={`search-filter-${key}`}
              placeholder={element.placeholder}
              loading={false}
              value={element.values?.[0]?.value}
              onSearch={(value) => element.onChange(value)}
              className="w-60"
            />
          );
        case FilterType.SELECT:
          return (
            <Select
              key={`select-filter-${key}`}
              value={element.defaultValue}
              placeholder={element.placeholder}
              className="w-60"
              onChange={(value) => element.onChange(value)}
              options={element.values}
            />
          );
        case FilterType.SELECT_SEARCH:
          return (
            <Select
              key={`select-search-filter-${key}`}
              showSearch
              style={{ width: 200 }}
              placeholder={element.placeholder}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={element.values}
              onChange={(value) => element.onChange(value, element.key)}
            />
          );
      }
    });
  }, [filters]);

  return (
    <div className="flex w-full flex-wrap justify-center gap-4 md:justify-between">
      {components}
    </div>
  );
}
