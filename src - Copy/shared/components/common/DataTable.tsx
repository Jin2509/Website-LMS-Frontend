import React from 'react';
import { Button } from '../ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSort?: (key: string) => void;
  getSortDirection?: (key: string) => 'asc' | 'desc' | null;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  getSortDirection,
  emptyMessage = 'Không có dữ liệu'
}: DataTableProps<T>) {
  const renderSortIcon = (columnKey: string) => {
    if (!getSortDirection) return <ArrowUpDown className="w-4 h-4 ml-1" />;

    const direction = getSortDirection(columnKey);
    if (direction === 'asc') return <ArrowUp className="w-4 h-4 ml-1" />;
    if (direction === 'desc') return <ArrowDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left p-3 font-semibold text-gray-700"
              >
                {column.sortable && onSort ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort(column.key)}
                    className="flex items-center gap-1 -ml-2 hover:bg-gray-100"
                  >
                    {column.header}
                    {renderSortIcon(column.key)}
                  </Button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-3">
                    {column.render
                      ? column.render(item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
