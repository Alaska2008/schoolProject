import React from "react";

type Column = {
  header: string;
  accessor: string;
  className?: string;
};

type TableProps = {
  columns: Column[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
};

const Table: React.FC<TableProps> = ({ columns, data, renderRow }) => {
  return (
    <table className="w-full mt-4 text-xs">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
