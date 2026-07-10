import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  RefreshCw,
  Info,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableHeaderProps<TData> {
  table: Table<TData>;
}

export function TableHeader<TData>({ table }: TableHeaderProps<TData>) {
  const t = useTranslations("FirebaseMonitoring");
  const router = useRouter();
  const count = table.getFilteredRowModel().rows.length;

  const globalFilter = table.getState().globalFilter as { query: string; columns: string[] } | undefined;
  const searchQuery = globalFilter?.query || "";
  const searchColumns = globalFilter?.columns || [];

  const selectedCount = Object.keys(table.getState().rowSelection).length;
  const meta = table.options.meta as any;

  const handleDeleteSelected = () => {
    if (meta?.deleteBulkData) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const ids = selectedRows.map(row => (row.original as any).id);
      meta.deleteBulkData(ids);
    }
  };

  return (
    <>
      {/* Top metadata row */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-4 border-b border-border-default">
        <div className="flex flex-row items-center justify-between sm:justify-start gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-heading tabular-nums">
              {t("totalData", { count: count.toLocaleString() })}
            </span>
            <span title={t("totalDataTooltip")} className="flex items-center justify-center cursor-help">
              <Info className="h-4 w-4 text-body-subtle" />
            </span>
          </div>
          {selectedCount > 0 && (
            <Button 
              onClick={handleDeleteSelected}
              className="h-9 px-3 bg-danger hover:bg-danger-strong text-white font-medium shadow-sm w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("deleteSelected", { count: selectedCount })}
            </Button>
          )}
          <Button 
            onClick={() => router.refresh()}
            className="h-9 px-3 bg-brand hover:bg-brand-strong text-white font-medium shadow-sm w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("refreshData")}
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body-subtle" />
            <Input
              placeholder={t("searchData")}
              value={searchQuery}
              onChange={(e) => table.setGlobalFilter({ query: e.target.value, columns: searchColumns })}
              className="pl-9 h-9 w-full sm:w-[250px] rounded-full border-border-default bg-neutral-primary-soft text-body focus-visible:ring-brand focus-visible:ring-1"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto grid grid-cols-2 sm:flex">
            
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="h-9 px-3 border-border-default text-body font-medium hover:bg-neutral-secondary">
                    {t("actions")}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-[160px] p-2 rounded-[12px] bg-neutral-primary border-border-default shadow-lg">
                {table
                  .getAllColumns()
                  .filter((column) => column.getIsVisible() && column.id !== "select" && column.id !== "actions")
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize flex items-center gap-2 px-2 py-2 text-sm text-body hover:bg-neutral-tertiary-medium hover:text-heading cursor-pointer rounded-[12px]"
                        checked={searchColumns.includes(column.id)}
                        onCheckedChange={(value) => {
                          const newCols = value
                            ? [...searchColumns, column.id]
                            : searchColumns.filter((c) => c !== column.id);
                          table.setGlobalFilter({ query: searchQuery, columns: newCols });
                        }}
                      >
                        {column.id.replace("_", " ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="h-9 px-3 border-border-default text-body font-medium hover:bg-neutral-secondary">
                    <Filter className="mr-2 h-4 w-4" />
                    {t("filters")}
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-[160px] p-2 rounded-[12px] bg-neutral-primary border-border-default shadow-lg">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize flex items-center gap-2 px-2 py-2 text-sm text-body hover:bg-neutral-tertiary-medium hover:text-heading cursor-pointer rounded-[12px]"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id.replace("_", " ")}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </>
  );
}
