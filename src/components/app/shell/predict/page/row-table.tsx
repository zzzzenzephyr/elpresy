"use client";

import * as React from "react";
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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

import { PredictDataRow, columns } from "@/components/app/shell/predict/page/row-table/columns";
import { TableHeader as TableTopBar } from "@/components/app/shell/firebase/page/table/header";
import { TablePagination } from "@/components/app/shell/firebase/page/table/pagination";

export function RowTable({ data, headerAction }: { data: PredictDataRow[], headerAction?: React.ReactNode }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "Timestamp", desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false,
    predictedPowerWatt: data.some(d => d.predictedPowerWatt !== undefined),
  });

  // Update visibility if data changes (e.g. from train data to predicted data)
  React.useEffect(() => {
    setColumnVisibility(prev => ({
      ...prev,
      predictedPowerWatt: data.some(d => d.predictedPowerWatt !== undefined)
    }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  return (
    <div className="w-full bg-neutral-primary rounded-[12px] border border-border-default shadow-sm overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-border-default">
        {headerAction ? headerAction : <div />}
        <TablePagination table={table as any} />
      </div>

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <ShadcnTable className="w-full min-w-[700px]">
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
                  className="border-border-default hover:bg-neutral-secondary-soft transition-colors"
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

      <div className="p-4 border-t border-border-default">
        <TablePagination table={table as any} />
      </div>
    </div>
  );
}
