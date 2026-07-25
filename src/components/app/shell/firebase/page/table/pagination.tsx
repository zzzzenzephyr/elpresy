import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

import { useTranslations } from "next-intl";

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const t = useTranslations("FirebaseMonitoring");

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border-default bg-neutral-primary-soft">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <span className="text-sm text-body font-medium">{t("rowsPerPage")}</span>
          <Input
            type="number"
            min={1}
            value={table.getState().pagination.pageSize || ""}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val > 0) {
                table.setPageSize(val);
              }
            }}
            className="h-8 w-[70px] bg-neutral-primary border-border-default text-sm"
          />
        </div>
        <span className="text-sm text-body-subtle tabular-nums mt-2 sm:mt-0">
          {t("pageInfo", { start: startRow, end: endRow, total: totalRows })}
        </span>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto grid grid-cols-2 sm:flex">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="h-8 px-3 border-border-default text-body hover:bg-neutral-secondary flex items-center gap-1 justify-center sm:justify-start"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{t("previous")}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="h-8 px-3 border-border-default text-body hover:bg-neutral-secondary flex items-center gap-1 justify-center sm:justify-start"
        >
          <span>{t("next")}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
