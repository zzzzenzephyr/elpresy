"use client";

import * as React from "react";
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  FilterFn,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PreprocessDataRow, columns } from "@/components/app/shell/predict/page/table/columns";
import { TableHeader as TableTopBar } from "@/components/app/shell/firebase/page/table/header";
import { TablePagination } from "@/components/app/shell/firebase/page/table/pagination";

export function PredictTable({ data }: { data: any[] }) {
  const tableData = React.useMemo(() => {
    return data
      .filter((item: any) => {
        const records = Array.isArray(item.data) ? item.data : [];
        return records.some((r: any) => r.current != null && r.voltage != null && r.power_watt != null);
      })
      .map((item: any) => {
        const records = (Array.isArray(item.data) ? item.data : []).filter(
          (r: any) => r.current != null && r.voltage != null && r.power_watt != null
        );
        let sumCurrent = 0;
        let sumVoltage = 0;
        let sumPower = 0;

        records.forEach((record: any) => {
          sumCurrent += record.current || 0;
          sumVoltage += record.voltage || 0;
          sumPower += record.power_watt || 0;
        });

        const count = records.length || 1;
      return {
        id: item.id,
        created_at: item.created_at,
        data: {
          avgCurrent: Number((sumCurrent / count).toFixed(2)),
          avgVoltage: Number((sumVoltage / count).toFixed(2)),
          avgPower: Number((sumPower / count).toFixed(2)),
          totalData: records.length,
        }
      };
    });
  }, [data]);

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "Timestamp", desc: true }]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState({ query: "", columns: [] as string[] });
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false,
    select: true,
  });

  const customGlobalFilterFn: FilterFn<PreprocessDataRow> = (row, columnId, filterValue) => {
    const { query, columns } = filterValue as { query: string; columns: string[] };
    if (!query) return true;

    if (columns && columns.length > 0) {
      if (!columns.includes(columnId)) {
        return false;
      }
    }

    const value = row.getValue(columnId);
    if (value == null) return false;
    return String(value).toLowerCase().includes(String(query).toLowerCase());
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilterFn,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="w-full bg-neutral-primary rounded-[12px] border border-border-default shadow-sm overflow-hidden flex flex-col">
      <TableTopBar table={table as any} />

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <ShadcnTable className="w-full min-w-[900px]">
          <TableHeader className="bg-neutral-secondary-soft">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border-default hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-11 px-4 text-xs font-semibold text-body-subtle whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border-default hover:bg-neutral-secondary-soft transition-colors data-[state=selected]:bg-brand-softer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-body">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadcnTable>
      </div>

      <TablePagination table={table as any} />
    </div>
  );
}
