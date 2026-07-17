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
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableHeader as TableTopBar } from "@/components/app/shell/preprocessing/page/table/header";
import { TablePagination } from "@/components/app/shell/preprocessing/page/table/pagination";
import { useTranslations } from "next-intl";

export interface EditConfig {
  showTimestamp?: boolean;
  disableTimestamp?: boolean;
  disableOthers?: boolean;
}

export function ProcessTable<TData>({ 
  data, 
  columns, 
  setDataFilter,
  editConfig
}: { 
  data: TData[], 
  columns: ColumnDef<TData, any>[], 
  setDataFilter?: React.Dispatch<React.SetStateAction<TData[]>>,
  editConfig?: EditConfig
}) {
  const t = useTranslations("PreprocessingPage.Process");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState({ query: "", columns: [] as string[] });
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const customGlobalFilterFn: FilterFn<TData> = (row, columnId, filterValue) => {
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
    data,
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
    meta: {
      editConfig,
      updateData: (id: string, updatedRow: Partial<TData>) => {
        if (setDataFilter) {
          setDataFilter(old =>
            old.map(row => {
              if ((row as any).id === id) {
                return { ...row, ...updatedRow };
              }
              return row;
            })
          );
        }
      },
      deleteData: (id: string) => {
        if (setDataFilter) {
          setDataFilter(old => old.filter(row => (row as any).id !== id));
        }
      },
      deleteBulkData: (ids: string[]) => {
        if (setDataFilter) {
          setDataFilter(old => old.filter(row => !ids.includes((row as any).id)));
          setRowSelection({}); // Clear selection after deletion
        }
      }
    },
  });

  return (
    <div className="w-full bg-neutral-primary rounded-[12px] border border-border-default shadow-sm overflow-hidden flex flex-col">
      <TableTopBar table={table} />

      {/* Table Content */}
      <div className="w-full overflow-x-auto custom-scrollbar">
        <ShadcnTable className="w-full min-w-max">
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
              table.getRowModel().rows.map((row) => {
                // If the row has custom row styling injected via meta (optional approach)
                return (
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-body">
                  {t('noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </ShadcnTable>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
